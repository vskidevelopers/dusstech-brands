import type { LineItemFormValues } from "@/types/line-item";

export interface TotalsBreakdown {
  subtotal: number;
  discount: number;
  vatAmount: number;
  grandTotal: number;
  deliveryFee?: number;
  finalTotal: number;
}

/**
 * Calculate line total for a single item.
 */
export function calculateLineTotal(
  quantity: number,
  unitPrice: number,
  discount: number,
): number {
  const raw = quantity * unitPrice;
  return Math.max(0, raw - (discount || 0));
}

/**
 * Calculate totals from items + financial settings.
 * Used by both Quotations and Orders.
 */
export function calculateTotals(
  items: LineItemFormValues[],
  discount: number,
  vatEnabled: boolean,
  vatPercentage: number,
  deliveryFee: number = 0,
): TotalsBreakdown {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.line_total) || 0),
    0,
  );
  const safeDiscount = Number(discount) || 0;
  const vatAmount = vatEnabled ? subtotal * (vatPercentage / 100) : 0;
  const grandTotal = subtotal - safeDiscount + vatAmount;
  const finalTotal = grandTotal + (Number(deliveryFee) || 0);

  return {
    subtotal,
    discount: safeDiscount,
    vatAmount,
    grandTotal,
    deliveryFee: Number(deliveryFee) || 0,
    finalTotal,
  };
}
