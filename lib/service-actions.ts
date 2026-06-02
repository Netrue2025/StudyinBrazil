"use server";

import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { serviceOrderSchema } from "@/lib/validators";

export async function createServiceOrderState(
  _previousState: { ok: boolean; message: string; redirectTo?: string },
  formData: FormData
) {
  try {
    const parsed = serviceOrderSchema.safeParse({
      serviceId: String(formData.get("serviceId") || ""),
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      notes: String(formData.get("notes") || "")
    });

    if (!parsed.success) return { ok: false, message: "Invalid order details." };

    const service = await prisma.service.findUniqueOrThrow({ where: { id: parsed.data.serviceId } });
    const order = await prisma.serviceOrder.create({
      data: {
        serviceId: service.id,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        notes: parsed.data.notes,
        status: "Pending",
        paymentStatus: "Pending"
      }
    });

    const provider = getPaymentProvider();
    const payment = await provider.createPayment({ serviceOrderId: order.id, amount: service.price, currency: service.currency });

    return {
      ok: true,
      message: "Order created successfully. Redirecting...",
      redirectTo: payment.redirectUrl || `/payment-status/${order.id}`
    };
  } catch (error) {
    console.error("[StudyinBrazil service order error]", error);
    return { ok: false, message: "Order creation failed. Please try again." };
  }
}
