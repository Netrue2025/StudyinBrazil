import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackTransaction } from "@/lib/payments";
import { buildReceipt, encodeReceiptCookie, receiptCookieName } from "@/lib/receipts";
import { normalizeCurrency } from "@/lib/utils";
import { sendPaidOrderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function redirectUrl(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference") || url.searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(redirectUrl(request, "/services?payment=missing-reference"));
  }

  const payment = await prisma.payment.findFirst({
    where: { provider: "paystack", providerReference: reference },
    include: { serviceOrder: { include: { service: true } } }
  });

  if (!payment) {
    return NextResponse.redirect(redirectUrl(request, "/services?payment=unknown-reference"));
  }

  try {
    const verified = await verifyPaystackTransaction(reference);
    const amountMatches = verified.data?.amount === payment.amount;
    const currencyMatches = normalizeCurrency(verified.data?.currency) === normalizeCurrency(payment.currency);
    const isPaid = verified.status && verified.data?.status === "success" && amountMatches && currencyMatches;
    const status = isPaid ? "Paid" : "Failed";

    const [updatedPayment, updatedOrder] = await Promise.all([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          amount: verified.data?.amount || payment.amount,
          currency: verified.data?.currency || payment.currency,
          status
        }
      }),
      prisma.serviceOrder.update({
        where: { id: payment.serviceOrderId },
        data: {
          paymentStatus: status,
          status: isPaid ? "In Progress" : payment.serviceOrder.status
        },
        include: { service: true }
      })
    ]);

    const destination = `/payment-status/${payment.serviceOrderId}${isPaid ? "?receipt=1" : "?payment=failed"}`;
    const response = NextResponse.redirect(redirectUrl(request, destination));

    if (isPaid) {
      const receipt = buildReceipt(updatedOrder, updatedPayment);
      receipt.paidAt = verified.data?.paid_at || new Date().toISOString();
      try {
        await sendPaidOrderEmail(receipt);
      } catch (emailError) {
        console.error("[StudyinBrazil payment receipt email error]", emailError);
      }
      response.cookies.set(receiptCookieName(updatedOrder.id), encodeReceiptCookie(receipt), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: `/payment-status/${updatedOrder.id}`,
        maxAge: 60 * 60 * 24 * 90
      });
    }

    return response;
  } catch (error) {
    console.error("[StudyinBrazil Paystack callback error]", error);
    await Promise.all([
      prisma.payment.update({ where: { id: payment.id }, data: { status: "Failed" } }),
      prisma.serviceOrder.update({ where: { id: payment.serviceOrderId }, data: { paymentStatus: "Failed" } })
    ]);
    return NextResponse.redirect(redirectUrl(request, `/payment-status/${payment.serviceOrderId}?payment=failed`));
  }
}
