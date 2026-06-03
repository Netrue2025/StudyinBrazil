"use client";

import { useEffect } from "react";
import { Download } from "lucide-react";
import type { ReceiptPayload } from "@/lib/receipts";
import { money } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const pageWidth = 595;
const pageHeight = 842;

function pdfText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function pdfMoney(receipt: ReceiptPayload) {
  const value = new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(receipt.amount / 100);
  return `${receipt.currency.toUpperCase()} ${value}`;
}

function line(label: string, value: string, x: number, y: number) {
  return [
    "0.38 0.45 0.55 rg",
    "BT /F2 9 Tf",
    `${x} ${y} Td (${pdfText(label.toUpperCase())}) Tj`,
    "ET",
    "0.05 0.09 0.16 rg",
    "BT /F2 12 Tf",
    `${x} ${y - 17} Td (${pdfText(value)}) Tj`,
    "ET"
  ].join("\n");
}

function wrappedText(text: string, x: number, y: number, maxChars = 68) {
  const words = pdfText(text).split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (`${current} ${word}`.trim().length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current);
  return lines
    .slice(0, 4)
    .map((item, index) => `BT /F1 10 Tf ${x} ${y - index * 14} Td (${item}) Tj ET`)
    .join("\n");
}

function createPdfReceipt(receipt: ReceiptPayload) {
  const paidAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(receipt.paidAt));
  const content = [
    "0.98 0.99 1 rg",
    `0 0 ${pageWidth} ${pageHeight} re f`,
    "0.04 0.48 0.33 rg",
    `0 ${pageHeight - 128} ${pageWidth} 128 re f`,
    "0.97 0.74 0.20 rg",
    `0 ${pageHeight - 132} ${pageWidth} 6 re f`,
    "1 1 1 rg",
    "BT /F2 24 Tf 48 760 Td (StudyinBrazil) Tj ET",
    "BT /F1 11 Tf 48 738 Td (International education service payment receipt) Tj ET",
    "0.97 0.74 0.20 rg",
    "390 744 126 32 re f",
    "0.05 0.09 0.16 rg",
    "BT /F2 12 Tf 415 754 Td (PAID) Tj ET",
    "0.05 0.09 0.16 rg",
    "BT /F2 28 Tf 48 665 Td (Payment Receipt) Tj ET",
    `BT /F1 12 Tf 48 642 Td (Receipt ${pdfText(receipt.receiptNumber)}) Tj ET`,
    "0.88 0.91 0.95 RG",
    "48 620 499 0.8 re f",
    line("Customer", receipt.customerName, 48, 580),
    line("Email", receipt.customerEmail, 300, 580),
    line("Phone", receipt.customerPhone || "Not provided", 48, 520),
    line("Payment date", paidAt, 300, 520),
    "0.96 0.98 0.97 rg",
    "48 376 499 104 re f",
    "0.04 0.48 0.33 RG",
    "48 376 499 104 re S",
    "0.05 0.09 0.16 rg",
    "BT /F2 13 Tf 68 448 Td (Service purchased) Tj ET",
    wrappedText(receipt.serviceTitle, 68, 428),
    "0.04 0.48 0.33 rg",
    "BT /F2 24 Tf 390 428 Td (" + pdfText(pdfMoney(receipt)) + ") Tj ET",
    line("Provider", receipt.provider, 48, 330),
    line("Reference", receipt.reference, 300, 330),
    line("Order ID", receipt.orderId, 48, 270),
    line("Status", receipt.status, 300, 270),
    "0.88 0.91 0.95 RG",
    "48 205 499 0.8 re f",
    "0.38 0.45 0.55 rg",
    "BT /F1 10 Tf 48 178 Td (Thank you for choosing StudyinBrazil. Keep this receipt for your records.) Tj ET",
    "BT /F1 9 Tf 48 156 Td (This receipt was generated automatically after Paystack payment verification.) Tj ET"
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function downloadReceipt(receipt: ReceiptPayload) {
  const blob = createPdfReceipt(receipt);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${receipt.receiptNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function PaymentReceipt({
  receipt,
  autoDownload = false
}: {
  receipt: ReceiptPayload;
  autoDownload?: boolean;
}) {
  useEffect(() => {
    if (!autoDownload) return;
    const storageKey = `receipt-downloaded-${receipt.receiptNumber}`;
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "true");
    downloadReceipt(receipt);
  }, [autoDownload, receipt]);

  return (
    <div className="mt-6 rounded-lg border border-brand-green/20 bg-emerald-50/60 p-5 text-left">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-brand-green">Receipt generated</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{receipt.receiptNumber}</h2>
        </div>
        <Button type="button" variant="secondary" onClick={() => downloadReceipt(receipt)} className="w-full sm:w-auto">
          <Download className="h-4 w-4" />
          Download PDF Receipt
        </Button>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <div><span className="block text-slate-500">Service</span><strong>{receipt.serviceTitle}</strong></div>
        <div><span className="block text-slate-500">Amount</span><strong>{money(receipt.amount, receipt.currency)}</strong></div>
        <div><span className="block text-slate-500">Customer</span><strong>{receipt.customerName}</strong></div>
        <div><span className="block text-slate-500">Email</span><strong>{receipt.customerEmail}</strong></div>
        <div><span className="block text-slate-500">Provider</span><strong>{receipt.provider}</strong></div>
        <div><span className="block text-slate-500">Reference</span><strong className="break-all">{receipt.reference}</strong></div>
      </div>
    </div>
  );
}
