import { notFound, redirect } from "next/navigation";
import { CreditCard, Upload } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { money, parseList } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { serviceOrderSchema } from "@/lib/validators";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  return { title: service?.title || "Service Payment" };
}

async function createOrder(formData: FormData) {
  "use server";
  const parsed = serviceOrderSchema.safeParse({
    serviceId: String(formData.get("serviceId") || ""),
    fullName: String(formData.get("fullName") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    notes: String(formData.get("notes") || "")
  });
  if (!parsed.success) throw new Error("Invalid order details");

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
  await provider.createPayment({ serviceOrderId: order.id, amount: service.price, currency: service.currency });
  redirect(`/payment-status/${order.id}`);
}

export default async function ServicePaymentPage({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service) notFound();

  return (
    <section className="container-shell py-10">
      <div className="mb-6 text-sm font-semibold text-slate-500">
        <a href="/services" className="text-brand-green">Services</a> / {service.title}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Badge tone="yellow">{service.deliveryTime}</Badge>
          <h1 className="mt-4 text-4xl font-black text-slate-950">{service.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{service.description}</p>
          <p className="mt-6 text-4xl font-black text-brand-green">{money(service.price, service.currency)}</p>
          <h2 className="mt-8 text-xl font-bold text-slate-950">What is included</h2>
          <ul className="mt-4 grid gap-3 text-slate-600">
            {parseList(service.includes).map((item) => <li key={item} className="rounded-md bg-slate-50 px-4 py-3">{item}</li>)}
          </ul>
        </article>
        <form action={createOrder} className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="serviceId" value={service.id} />
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-blue" />
            <h2 className="text-lg font-bold text-slate-950">Payment details</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">Manual payment mode creates a pending order for admin follow-up.</p>
          <div className="mt-5 grid gap-4">
            <Field label="Full name"><Input name="fullName" required /></Field>
            <Field label="Email"><Input type="email" name="email" required /></Field>
            <Field label="Phone / WhatsApp"><Input name="phone" required /></Field>
            <Field label="Upload relevant document"><Input type="file" name="document" className="h-auto py-2" /></Field>
            <Field label="Notes"><Textarea name="notes" placeholder="Add your target program, deadline, or document context." /></Field>
          </div>
          <Button className="mt-5 w-full" type="submit">
            Create Pending Order <Upload className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}
