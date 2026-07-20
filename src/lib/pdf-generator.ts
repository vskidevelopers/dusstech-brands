/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { QuotationWithItems } from "@/features/quotations/types";
import type { Settings } from "@/features/settings/types";
import { formatFullAddress } from "@/features/settings/utils";

export interface PdfGenerationOptions {
  quotation: QuotationWithItems;
  settings: Settings;
}

/**
 * Strips HTML tags and entities from rich text for clean PDF rendering.
 */
function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ") // Replace HTML tags with a space
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}

export function generateQuotationPdf({
  quotation,
  settings,
}: PdfGenerationOptions) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // === COLORS ===
  const textDark: [number, number, number] = [40, 40, 40];
  const textMuted: [number, number, number] = [100, 100, 100];
  const mottoRed: [number, number, number] = [220, 38, 38]; // Vibrant red for motto

  // === 1. HEADER: Business Info ===
  // Bold Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...textDark);
  doc.text(settings.business_name || "DUSSTECH BRANDS", 14, 20);

  // Red Italic Tagline
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(...mottoRed);
  doc.text(`"${settings.tagline || "Own Your Brand"}"`, 14, 28);

  // Reset text color for the rest of the document
  doc.setTextColor(...textDark);

  // === 2. QUOTATION DETAILS (Right Side) ===
  // Bold "QUOTATION"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("QUOTATION", pageWidth - 14, 20, { align: "right" });

  // Formatted Quote Number (DBQ- instead of QT-)
  const displayQuoteNumber = (quotation.quote_number || "").replace(
    /^QT-/i,
    "DBQ-",
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`No. ${displayQuoteNumber}`, pageWidth - 14, 28, { align: "right" });

  doc.text(
    `Date: ${new Date(quotation.created_at).toLocaleDateString()}`,
    pageWidth - 14,
    34,
    { align: "right" },
  );
  if (quotation.valid_until) {
    doc.text(
      `Valid Until: ${new Date(quotation.valid_until).toLocaleDateString()}`,
      pageWidth - 14,
      40,
      { align: "right" },
    );
  }

  // === 3. CUSTOMER INFO ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Bill To:", 14, 50);

  doc.setFontSize(10);
  doc.text(quotation.customer_name, 14, 56);
  if (quotation.company_name) doc.text(quotation.company_name, 14, 61);
  if (quotation.phone) doc.text(`Phone: ${quotation.phone}`, 14, 66);
  if (quotation.email) doc.text(`Email: ${quotation.email}`, 14, 71);

  // === 4. ITEMS TABLE ===
  const currency = settings.currency_symbol || "KES";
  const formatMoney = (n: number) =>
    `${currency} ${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const tableData = quotation.items.map((item, index) => [
    index + 1,
    item.description,
    item.quantity,
    formatMoney(item.unit_price),
    item.discount > 0 ? `-${formatMoney(item.discount)}` : "-",
    formatMoney(item.line_total),
  ]);

  autoTable(doc, {
    startY: 80,
    head: [["#", "Description", "Qty", "Unit Price", "Discount", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [40, 40, 40],
      textColor: 255,
      fontStyle: "normal",
    }, // Simple dark header, no bold
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "center", cellWidth: 20 },
      3: { halign: "right", cellWidth: 35 },
      4: { halign: "right", cellWidth: 35 },
      5: { halign: "right", cellWidth: 35 },
    },
  });

  // === 5. TOTALS ===
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  let y = finalY;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Align all totals to the right edge of the table (pageWidth - 14)
  const alignRight = { align: "right" as const };
  const rightEdgeX = pageWidth - 14;

  doc.text(
    `Subtotal: ${formatMoney(quotation.subtotal)}`,
    rightEdgeX,
    y,
    alignRight,
  );

  if (quotation.discount > 0) {
    y += 6;
    doc.text(
      `Discount: -${formatMoney(quotation.discount)}`,
      rightEdgeX,
      y,
      alignRight,
    );
  }
  if (quotation.vat_enabled) {
    y += 6;
    doc.text(
      `VAT (${quotation.vat_percentage}%): ${formatMoney(quotation.vat_amount)}`,
      rightEdgeX,
      y,
      alignRight,
    );
  }

  // Grand Total (Bold, aligned perfectly with the table's right edge)
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    `Grand Total: ${formatMoney(quotation.grand_total)}`,
    rightEdgeX,
    y,
    alignRight,
  );
  // === 6. NOTES & TERMS (HTML Stripped) ===
  let notesY = y + 20;

  // Strip HTML tags so it doesn't show <p>...</p>
  const cleanNotes = stripHtml(quotation.notes || "");
  const cleanTerms = stripHtml(quotation.terms || "");

  if (cleanNotes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Notes:", 14, notesY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    const splitNotes = doc.splitTextToSize(cleanNotes, pageWidth - 28);
    doc.text(splitNotes, 14, notesY + 6);
    notesY += splitNotes.length * 5 + 15;
    doc.setTextColor(...textDark); // Reset color
  }

  if (cleanTerms) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Terms & Conditions:", 14, notesY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    const splitTerms = doc.splitTextToSize(cleanTerms, pageWidth - 28);
    doc.text(splitTerms, 14, notesY + 6);
  }

  // === 7. FOOTER ===

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated by ${settings.business_name} · ${settings.tagline || ""}`.trim(),
    14,
    280,
  );

  // Save the PDF
  doc.save(`${displayQuoteNumber}.pdf`);
}
