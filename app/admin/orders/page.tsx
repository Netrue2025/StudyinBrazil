import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "@/lib/admin-actions";
import { money } from "@/lib/utils";
import { paymentStatuses, serviceOrderStatuses } from "@/lib/constants";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
  requireAdmin();
  const orders = await prisma.serviceOrder.findMany({
    include: { service: true, payments: true },
    orderBy: { createdAt: "desc" }
  });
  return (
    <>
      <AdminPageHeader title="Service Orders" eyebrow="Payments and delivery" />
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div>
                <div className="flex flex-wrap gap-2"><Badge tone="blue">{order.status}</Badge><Badge tone="yellow">{order.paymentStatus}</Badge></div>
                <h2 className="mt-3 text-xl font-bold text-slate-950">{order.service.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{order.fullName} · {order.email} · {order.phone}</p>
              </div>
              <p className="text-2xl font-black text-brand-green">{money(order.service.price, order.service.currency)}</p>
            </div>
            <p className="mt-4 text-sm text-slate-600">{order.notes || "No client notes."}</p>
            <form action={updateOrderStatus} className="mt-5 grid gap-4 md:grid-cols-[180px_180px_1fr_auto] md:items-end">
              <input type="hidden" name="id" value={order.id} />
              <Field label="Order status"><Select name="status" defaultValue={order.status}>{serviceOrderStatuses.map((status) => <option key={status}>{status}</option>)}</Select></Field>
              <Field label="Payment status"><Select name="paymentStatus" defaultValue={order.paymentStatus}>{paymentStatuses.map((status) => <option key={status}>{status}</option>)}</Select></Field>
              <Field label="Admin notes"><Textarea name="adminNotes" defaultValue={order.adminNotes || ""} /></Field>
              <Button>Update</Button>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
