import { money } from "@/lib/utils";

export type ReceiptPayload = {
  receiptNumber: string;
  orderId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  provider: string;
  reference: string;
  paidAt: string;
  status: string;
};

type ReceiptOrder = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  paymentStatus: string;
  createdAt: Date;
  service: {
    title: string;
    price: number;
    currency: string;
  };
};

type ReceiptPayment = {
  amount: number;
  currency: string;
  provider: string;
  providerReference: string | null;
  status: string;
  createdAt: Date;
} | null;

export function receiptCookieName(orderId: string) {
  return `sib_receipt_${orderId}`;
}

export function buildReceipt(order: ReceiptOrder, payment: ReceiptPayment): ReceiptPayload {
  const reference = payment?.providerReference || order.id;
  return {
    receiptNumber: `SIB-${order.id.slice(-8).toUpperCase()}`,
    orderId: order.id,
    serviceTitle: order.service.title,
    customerName: order.fullName,
    customerEmail: order.email,
    customerPhone: order.phone,
    amount: payment?.amount || order.service.price,
    currency: payment?.currency || order.service.currency,
    provider: payment?.provider || "manual",
    reference,
    paidAt: (payment?.createdAt || order.createdAt).toISOString(),
    status: payment?.status || order.paymentStatus
  };
}

export function encodeReceiptCookie(receipt: ReceiptPayload) {
  return encodeURIComponent(JSON.stringify(receipt));
}

export function decodeReceiptCookie(value?: string): ReceiptPayload | null {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as ReceiptPayload;
  } catch {
    return null;
  }
}

export function receiptText(receipt: ReceiptPayload) {
  return [
    "StudyinBrazil Payment Receipt",
    `Receipt: ${receipt.receiptNumber}`,
    `Order ID: ${receipt.orderId}`,
    `Service: ${receipt.serviceTitle}`,
    `Customer: ${receipt.customerName}`,
    `Email: ${receipt.customerEmail}`,
    `Phone: ${receipt.customerPhone}`,
    `Amount: ${money(receipt.amount, receipt.currency)}`,
    `Provider: ${receipt.provider}`,
    `Reference: ${receipt.reference}`,
    `Status: ${receipt.status}`,
    `Paid at: ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(receipt.paidAt))}`
  ].join("\n");
}
