import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function PaymentStatusPage({ params }: { params: { id: string } }) {
  const order = await prisma.serviceOrder.findUnique({
    where: { id: params.id },
    include: { service: true, payments: true }
  });
  if (!order) notFound();
  const payment = order.payments[0];

  return (
    <section className="container-shell flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-14 w-14 text-brand-green" />
        <h1 className="mt-4 text-3xl font-black text-slate-950">Order created</h1>
        <p className="mt-3 text-slate-600">Your service order is stored with pending manual payment status.</p>
        <div className="mt-6 rounded-lg bg-slate-50 p-5 text-left">
          <div className="flex justify-between gap-4 py-2"><span>Service</span><strong>{order.service.title}</strong></div>
          <div className="flex justify-between gap-4 py-2"><span>Amount</span><strong>{money(order.service.price, order.service.currency)}</strong></div>
          <div className="flex justify-between gap-4 py-2"><span>Provider</span><strong>{payment?.provider || "manual"}</strong></div>
          <div className="flex justify-between gap-4 py-2"><span>Status</span><Badge tone="yellow">{order.paymentStatus}</Badge></div>
          <div className="flex justify-between gap-4 py-2"><span>Reference</span><strong>{payment?.providerReference || order.id}</strong></div>
        </div>
        <LinkButton href="/" className="mt-6">Back Home</LinkButton>
      </div>
    </section>
  );
}
