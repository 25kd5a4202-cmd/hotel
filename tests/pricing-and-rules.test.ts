import { calculateOrderFinancials, formatPrice } from "../src/lib/pricing";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("🧪 Running Financial and Business Rule Unit Tests...");

// 1. Format Price
console.log("  Testing formatPrice...");
assert(formatPrice(54900) === "₹549", `Expected ₹549, got ${formatPrice(54900)}`);
assert(formatPrice(54950) === "₹549.50", `Expected ₹549.50, got ${formatPrice(54950)}`);

// 2. Financial calculation: Subtotal below free delivery threshold
console.log("  Testing financials (below threshold)...");
{
  const res = calculateOrderFinancials({
    subtotal: 30000, // ₹300.00
    discountTotal: 0,
    isPickup: false,
    deliveryFeeRate: 4000, // ₹40.00
    freeDeliveryThreshold: 50000, // ₹500.00
    taxPercentage: 5.0,
  });

  assert(res.subtotal === 30000, "Subtotal should match");
  assert(res.deliveryFee === 4000, `Delivery fee should be 4000, got ${res.deliveryFee}`);
  // Tax: 5% of 30000 = 1500
  assert(res.taxTotal === 1500, `Tax should be 1500, got ${res.taxTotal}`);
  // Grand total: 30000 + 4000 + 1500 = 35500
  assert(res.grandTotal === 35500, `Grand total should be 35500, got ${res.grandTotal}`);
}

// 3. Financial calculation: Subtotal above free delivery threshold
console.log("  Testing financials (free delivery qualifying)...");
{
  const res = calculateOrderFinancials({
    subtotal: 60000, // ₹600.00
    discountTotal: 10000, // ₹100.00 discount
    isPickup: false,
    deliveryFeeRate: 4000,
    freeDeliveryThreshold: 50000,
    taxPercentage: 5.0,
  });

  assert(res.deliveryFee === 0, "Delivery fee should be FREE above ₹500");
  // Taxable: 60000 - 10000 = 50000. 5% of 50000 = 2500
  assert(res.taxTotal === 2500, `Tax should be 2500, got ${res.taxTotal}`);
  // Grand total: 50000 + 0 + 2500 = 52500
  assert(res.grandTotal === 52500, `Grand total should be 52500, got ${res.grandTotal}`);
}

// 4. Financial calculation: Self Pickup (no delivery fee)
console.log("  Testing self-pickup fee bypass...");
{
  const res = calculateOrderFinancials({
    subtotal: 25000,
    isPickup: true,
    deliveryFeeRate: 4000,
    freeDeliveryThreshold: 50000,
    taxPercentage: 5.0,
  });

  assert(res.deliveryFee === 0, "Pickup orders must never charge delivery fee");
}

console.log("✅ All Pricing and Financial Unit Tests PASSED!\n");
