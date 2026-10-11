import prisma from "../src/lib/db";
import { getCategories, getProducts } from "../src/services/menu";
import { validateCoupon } from "../src/services/coupons";
import { createOrderTransaction, updateOrderStatus, getOrderByNumberOrId } from "../src/services/orders";
import { OrderStatus } from "@prisma/client";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runIntegration() {
  console.log("🚀 Running Neon Database & Core Workflow Integration Tests...");

  // 1. Database read: Categories & Products
  console.log("  Step 1: Testing Neon DB read for menu categories & products...");
  const categories = await getCategories();
  assert(categories.length > 0, "Categories count must be > 0");
  const products = await getProducts();
  assert(products.length > 0, "Products count must be > 0");
  console.log(`  ✓ Loaded ${categories.length} categories and ${products.length} products directly from Neon`);

  // 2. Coupon Validation
  console.log("  Step 2: Testing Coupon validation engine...");
  const couponRes = await validateCoupon("WELCOME50", 40000);
  assert(couponRes.valid === true, "WELCOME50 should be valid for ₹400 subtotal");
  assert(couponRes.coupon?.discountAmount === 15000, "50% capped at max ₹150 (15000 paise)");
  console.log(`  ✓ Coupon validated: discount = ₹${couponRes.coupon?.discountAmount! / 100}`);

  // 3. Transactional Order Creation
  console.log("  Step 3: Testing Transactional Order creation on Neon...");
  const testProduct = products[0];
  const order = await createOrderTransaction({
    customerName: "Integration Test User",
    customerEmail: "integration@test.com",
    customerPhone: "+91 99999 88888",
    orderType: "DELIVERY",
    deliveryAddress: {
      street: "Test Suite Lane 1",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560001",
    },
    paymentMethod: "COD",
    couponCode: "WELCOME50",
    notes: "Automated test order verification",
    items: [
      {
        productId: testProduct.id,
        quantity: 1,
      },
    ],
  });

  assert(Boolean(order.id), "Order ID must exist");
  assert(order.status === OrderStatus.PENDING, "Initial status must be PENDING");
  assert(order.items.length === 1, "Order items snapshot count must be 1");
  console.log(`  ✓ Order created successfully: ${order.orderNumber} (Grand total: ₹${order.grandTotal / 100})`);

  // 4. Order Status Transition State Machine
  console.log("  Step 4: Testing Status Transitions State Machine...");
  const accepted = await updateOrderStatus(order.id, OrderStatus.CONFIRMED, "Accepted in test", "Integration Test");
  assert(accepted.status === OrderStatus.CONFIRMED, "Order status should be CONFIRMED");

  const preparing = await updateOrderStatus(order.id, OrderStatus.PREPARING, "Moved to kitchen", "Integration Test");
  assert(preparing.status === OrderStatus.PREPARING, "Order status should be PREPARING");
  console.log(`  ✓ Order successfully progressed: PENDING -> CONFIRMED -> PREPARING`);

  // 5. Verification by orderNumber
  const verified = await getOrderByNumberOrId(order.orderNumber);
  assert(verified !== null && verified.id === order.id, "Lookup by orderNumber failed");
  assert(verified!.statusHistory.length >= 3, "Status history log count should be at least 3");
  console.log(`  ✓ Order history verification passed (${verified!.statusHistory.length} audit logs recorded)`);

  // Cleanup test order
  await prisma.order.delete({ where: { id: order.id } });
  console.log("  ✓ Test order cleaned up safely");

  console.log("\n🎉 All Neon Database & Workflow Integration Tests PASSED!\n");
}

runIntegration()
  .catch((e) => {
    console.error("❌ Integration test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
