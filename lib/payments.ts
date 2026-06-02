import { prisma } from "@/lib/prisma";

export type PaymentIntentInput = {
  serviceOrderId: string;
  amount: number;
  currency: string;
};

export interface PaymentProvider {
  name: string;
  createPayment(input: PaymentIntentInput): Promise<{ reference: string; status: string; redirectUrl?: string }>;
}

export class ManualPaymentProvider implements PaymentProvider {
  name = "manual";

  async createPayment(input: PaymentIntentInput) {
    const payment = await prisma.payment.create({
      data: {
        serviceOrderId: input.serviceOrderId,
        amount: input.amount,
        currency: input.currency,
        provider: this.name,
        providerReference: `MANUAL-${Date.now()}`,
        status: "Pending"
      }
    });
    return { reference: payment.providerReference || payment.id, status: payment.status };
  }
}

export class StripePlaceholderProvider implements PaymentProvider {
  name = "stripe";

  async createPayment(input: PaymentIntentInput) {
    const payment = await prisma.payment.create({
      data: {
        serviceOrderId: input.serviceOrderId,
        amount: input.amount,
        currency: input.currency,
        provider: this.name,
        providerReference: `STRIPE-TODO-${Date.now()}`,
        status: "Pending"
      }
    });
    return { reference: payment.providerReference || payment.id, status: payment.status };
  }
}

export function getPaymentProvider(): PaymentProvider {
  const mode = process.env.PAYMENT_PROVIDER || process.env.PAYMENT_MODE || "manual";
  if (mode === "stripe") return new StripePlaceholderProvider();
  return new ManualPaymentProvider();
}
