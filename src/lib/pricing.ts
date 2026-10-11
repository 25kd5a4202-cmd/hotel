export interface PriceBreakdown {
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  taxTotal: number;
  grandTotal: number;
}

export function formatPrice(minorUnits: number, symbol = "₹"): string {
  const major = minorUnits / 100;
  return `${symbol}${major.toLocaleString("en-IN", {
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateOrderFinancials(params: {
  subtotal: number;
  discountTotal?: number;
  isPickup?: boolean;
  deliveryFeeRate?: number;
  freeDeliveryThreshold?: number;
  taxPercentage?: number;
}): PriceBreakdown {
  const subtotal = Math.max(0, Math.floor(params.subtotal));
  const discountTotal = Math.min(subtotal, Math.max(0, Math.floor(params.discountTotal ?? 0)));
  const taxableSubtotal = Math.max(0, subtotal - discountTotal);

  // Delivery fee calculation
  let deliveryFee = 0;
  if (!params.isPickup) {
    const feeRate = params.deliveryFeeRate ?? 4000; // ₹40.00 default
    const threshold = params.freeDeliveryThreshold ?? 50000; // ₹500.00 default
    deliveryFee = subtotal >= threshold ? 0 : feeRate;
  }

  // Tax calculation (e.g. 5% GST)
  const taxPct = params.taxPercentage ?? 5.0;
  const taxTotal = Math.round((taxableSubtotal * taxPct) / 100);

  const grandTotal = taxableSubtotal + deliveryFee + taxTotal;

  return {
    subtotal,
    discountTotal,
    deliveryFee,
    taxTotal,
    grandTotal,
  };
}
