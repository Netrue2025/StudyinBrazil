import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/utils";
import { buildReceipt, decodeReceiptCookie, receiptCookieName } from "@/lib/receipts";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentReceipt } from "@/components/payment-receipt";

export const dynamic = "force-dynamic";

export default async function PaymentStatusPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { receipt?: string; payment?: string };
}) {
  const order = await prisma.serviceOrder.findUnique({
    where: { id: params.id },
    include: { service: true, payments: { orderBy: { createdAt: "desc" } } }
  });
  if (!order) notFound();
  const payment = order.payments[0];
  const cookieReceipt = decodeReceiptCookie(cookies().get(receiptCookieName(order.id))?.value);
  const receipt = cookieReceipt || (order.paymentStatus === "Paid" ? buildReceipt(order, payment) : null);
  const isPaid = order.paymentStatus === "Paid";
  const isFailed = order.paymentStatus === "Failed" || searchParams?.payment === "failed";
  const Icon = isPaid ? CheckCircle2 : isFailed ? XCircle : Clock3;
  const iconClass = isPaid ? "text-brand-green" : isFailed ? "text-red-600" : "text-brand-yellow";
  const title = isPaid ? "Payment successful" : isFailed ? "Payment failed" : "Order created";
  const message = isPaid
    ? "Your payment has been verified and your receipt is ready."
    : isFailed
      ? "The payment could not be verified. Please try again or contact support."
      : "Your service order is stored with pending payment status.";
  const badgeTone = isPaid ? "green" : isFailed ? "red" : "yellow";

  return (
    <section className="container-shell flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-soft">
        <Icon className={`mx-auto h-14 w-14 ${iconClass}`} />
        <h1 className="mt-4 text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-3 text-slate-600">{message}</p>
        <div className="mt-6 rounded-lg bg-slate-50 p-5 text-left">
          <div className="flex justify-between gap-4 py-2"><span>Service</span><strong>{order.service.title}</strong></div>
          <div className="flex justify-between gap-4 py-2"><span>Amount</span><strong>{money(order.service.price, order.service.currency)}</strong></div>
          <div className="flex justify-between gap-4 py-2"><span>Provider</span><strong>{payment?.provider || "manual"}</strong></div>
          <div className="flex justify-between gap-4 py-2"><span>Status</span><Badge tone={badgeTone}>{order.paymentStatus}</Badge></div>
          <div className="flex justify-between gap-4 py-2"><span>Reference</span><strong className="break-all">{payment?.providerReference || order.id}</strong></div>
        </div>
        {receipt ? <PaymentReceipt receipt={receipt} autoDownload={searchParams?.receipt === "1"} /> : null}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/services" variant="outline">Back to Services</LinkButton>
          <LinkButton href="/">Back Home</LinkButton>
        </div>
      </div>
    </section>
  );
}
