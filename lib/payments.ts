import { prisma } from "@/lib/prisma";
import { normalizeCurrency } from "@/lib/utils";

export type PaymentIntentInput = {
  serviceOrderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  description: string;
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

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url?: string;
    access_code?: string;
    reference?: string;
  };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    amount: number;
    currency: string;
    reference: string;
    status: string;
    paid_at?: string;
    gateway_response?: string;
  };
};

function appUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function paystackRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY is not configured.");

  const response = await fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });
  const payload = (await response.json()) as T & { message?: string };
  if (!response.ok) throw new Error(payload.message || "Paystack request failed.");
  return payload;
}

export class PaystackPaymentProvider implements PaymentProvider {
  name = "paystack";

  async createPayment(input: PaymentIntentInput) {
    const reference = `SIB_${input.serviceOrderId}_${Date.now()}`;
    const payment = await prisma.payment.create({
      data: {
        serviceOrderId: input.serviceOrderId,
        amount: input.amount,
        currency: normalizeCurrency(input.currency),
        provider: this.name,
        providerReference: reference,
        status: "Pending"
      }
    });

    try {
      const payload = await paystackRequest<PaystackInitializeResponse>("/transaction/initialize", {
        method: "POST",
        body: JSON.stringify({
          amount: input.amount,
          email: input.customerEmail,
          currency: normalizeCurrency(input.currency),
          reference,
          callback_url: `${appUrl()}/api/payments/paystack/callback`,
          metadata: {
            serviceOrderId: input.serviceOrderId,
            paymentId: payment.id,
            customerName: input.customerName,
            description: input.description
          }
        })
      });

      if (!payload.status || !payload.data?.authorization_url) {
        throw new Error(payload.message || "Paystack did not return a payment URL.");
      }

      return {
        reference: payload.data.reference || reference,
        status: payment.status,
        redirectUrl: payload.data.authorization_url
      };
    } catch (error) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "Failed" } });
      throw error;
    }
  }
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackRequest<PaystackVerifyResponse>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

export function getPaymentProvider(): PaymentProvider {
  const mode = (process.env.PAYMENT_PROVIDER || process.env.PAYMENT_MODE || "manual").toLowerCase();
  if (mode === "paystack") return new PaystackPaymentProvider();
  if (mode === "stripe") return new StripePlaceholderProvider();
  return new ManualPaymentProvider();
}
