import type { ReceiptPayload } from "@/lib/receipts";
import { money } from "@/lib/utils";

type EmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

async function sendWithResend(input: EmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.warn("[StudyinBrazil email] RESEND_API_KEY or EMAIL_FROM is not configured. Email skipped.");
    return { sent: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Email sending failed: ${message}`);
  }

  return { sent: true };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendPaidOrderEmail(receipt: ReceiptPayload) {
  const paidAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(receipt.paidAt));
  const amount = money(receipt.amount, receipt.currency);
  const customerName = escapeHtml(receipt.customerName);
  const receiptNumber = escapeHtml(receipt.receiptNumber);
  const serviceTitle = escapeHtml(receipt.serviceTitle);
  const reference = escapeHtml(receipt.reference);

  return sendWithResend({
    to: receipt.customerEmail,
    subject: `StudyinBrazil payment receipt ${receipt.receiptNumber}`,
    text: [
      `Hello ${receipt.customerName},`,
      "",
      "Your StudyinBrazil service payment was successful.",
      "",
      `Receipt: ${receipt.receiptNumber}`,
      `Service: ${receipt.serviceTitle}`,
      `Amount: ${amount}`,
      `Payment provider: ${receipt.provider}`,
      `Reference: ${receipt.reference}`,
      `Paid at: ${paidAt}`,
      "",
      "We have received your order and our team will review it shortly.",
      "",
      "StudyinBrazil"
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h1 style="margin:0 0 12px;color:#0b7a53">Payment received</h1>
        <p>Hello ${customerName},</p>
        <p>Your StudyinBrazil service payment was successful. We have received your order and our team will review it shortly.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Receipt</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>${receiptNumber}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Service</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>${serviceTitle}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Amount</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>${amount}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Reference</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>${reference}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Paid at</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>${paidAt}</strong></td></tr>
        </table>
        <p>Thank you for choosing StudyinBrazil.</p>
      </div>
    `
  });
}
