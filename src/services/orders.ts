import prisma from "@/lib/db";
import { OrderType, OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import { calculateOrderFinancials } from "@/lib/pricing";
import { validateCoupon } from "@/services/coupons";
import { getRestaurantSettings } from "@/services/settings";

export interface CreateOrderInput {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: "DELIVERY" | "PICKUP";
  deliveryAddress?: {
    street: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  paymentMethod: "COD" | "RAZORPAY" | "ONLINE";
  couponCode?: string;
  notes?: string;
  idempotencyKey?: string;
  items: Array<{
    productId: string;
    variantId?: string;
    selectedAddOnIds?: string[];
    quantity: number;
  }>;
}

export async function createOrderTransaction(input: CreateOrderInput) {
  // 1. Idempotency check
  if (input.idempotencyKey) {
    const existing = await prisma.order.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
      include: { items: true, statusHistory: true, payments: true },
    });
    if (existing) return existing;
  }

  // 2. Load restaurant settings
  const settings = await getRestaurantSettings();
  if (!settings.isOpen) {
    throw new Error("Restaurant is currently closed for new orders.");
  }

  // 3. Validate & fetch products, variants, add-ons
  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: {
      variants: true,
      addOnGroups: { include: { options: true } },
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const validatedItems: Array<{
    productId: string;
    productName: string;
    variantName?: string;
    selectedAddOns: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }> = [];

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product || !product.isAvailable) {
      throw new Error(`Item "${product?.name || "Unknown"}" is currently unavailable.`);
    }

    let unitPrice = product.basePrice;
    let variantName: string | undefined = undefined;

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (variant && variant.isAvailable) {
        unitPrice += variant.priceModifier;
        variantName = variant.name;
      }
    }

    const selectedAddOnsList: Array<{ id: string; name: string; price: number }> = [];
    if (item.selectedAddOnIds && item.selectedAddOnIds.length > 0) {
      const allOptions = product.addOnGroups.flatMap((g) => g.options);
      for (const addonId of item.selectedAddOnIds) {
        const option = allOptions.find((o) => o.id === addonId);
        if (option && option.isAvailable) {
          unitPrice += option.price;
          selectedAddOnsList.push({
            id: option.id,
            name: option.name,
            price: option.price,
          });
        }
      }
    }

    const itemTotalPrice = unitPrice * item.quantity;
    subtotal += itemTotalPrice;

    validatedItems.push({
      productId: product.id,
      productName: product.name,
      variantName,
      selectedAddOns: JSON.stringify(selectedAddOnsList),
      unitPrice,
      quantity: item.quantity,
      totalPrice: itemTotalPrice,
    });
  }

  // Minimum order check
  if (subtotal < settings.minOrderAmount) {
    const minMajor = (settings.minOrderAmount / 100).toFixed(0);
    throw new Error(`Minimum order subtotal must be at least ₹${minMajor}.`);
  }

  // 4. Coupon validation
  let discountTotal = 0;
  let couponIdToRedeem: string | undefined = undefined;

  if (input.couponCode) {
    const couponRes = await validateCoupon(input.couponCode, subtotal);
    if (couponRes.valid && couponRes.coupon) {
      discountTotal = couponRes.coupon.discountAmount;
      couponIdToRedeem = couponRes.coupon.id;
    }
  }

  // 5. Calculate financials
  const financials = calculateOrderFinancials({
    subtotal,
    discountTotal,
    isPickup: input.orderType === "PICKUP",
    deliveryFeeRate: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    taxPercentage: settings.taxPercentage,
  });

  // 6. Generate unique order reference
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `ORD-${new Date().getFullYear()}-${randomSuffix}`;

  // 7. Execute transactional write
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: input.userId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        orderType: input.orderType as OrderType,
        deliveryAddress: input.deliveryAddress ? JSON.stringify(input.deliveryAddress) : null,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: input.paymentMethod as PaymentMethod,
        subtotal: financials.subtotal,
        discountTotal: financials.discountTotal,
        deliveryFee: financials.deliveryFee,
        taxTotal: financials.taxTotal,
        grandTotal: financials.grandTotal,
        couponCode: input.couponCode ? input.couponCode.toUpperCase() : null,
        notes: input.notes,
        idempotencyKey: input.idempotencyKey,
        items: {
          create: validatedItems,
        },
        statusHistory: {
          create: {
            status: OrderStatus.PENDING,
            notes: "Order placed by customer",
            changedBy: "Customer",
          },
        },
        payments: {
          create: {
            provider: input.paymentMethod as PaymentMethod,
            amount: financials.grandTotal,
            currency: settings.currencyCode,
            status: PaymentStatus.PENDING,
          },
        },
      },
      include: {
        items: true,
        statusHistory: true,
        payments: true,
      },
    });

    if (couponIdToRedeem) {
      await tx.coupon.update({
        where: { id: couponIdToRedeem },
        data: { usedCount: { increment: 1 } },
      });
      await tx.couponRedemption.create({
        data: {
          couponId: couponIdToRedeem,
          orderId: order.id,
          userId: input.userId,
        },
      });
    }

    return order;
  }, { maxWait: 10000, timeout: 25000 });
}

export async function getOrderByNumberOrId(ref: string) {
  return prisma.order.findFirst({
    where: {
      OR: [{ id: ref }, { orderNumber: ref }],
    },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      payments: true,
    },
  });
}

// Order Status Transitions validation state machine
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.READY_FOR_PICKUP,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string,
  changedBy = "Staff"
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const allowed = ALLOWED_TRANSITIONS[order.status];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Cannot transition order status from ${order.status} to ${newStatus}`);
  }

  return prisma.$transaction(async (tx) => {
    // If completing and paymentMethod is COD, mark payment PAID
    let newPaymentStatus = order.paymentStatus;
    if (newStatus === OrderStatus.COMPLETED && order.paymentMethod === PaymentMethod.COD) {
      newPaymentStatus = PaymentStatus.PAID;
      await tx.payment.updateMany({
        where: { orderId: order.id },
        data: { status: PaymentStatus.PAID },
      });
    }

    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        paymentStatus: newPaymentStatus,
      },
      include: {
        items: true,
        statusHistory: true,
        payments: true,
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: newStatus,
        notes: notes || `Order updated to ${newStatus}`,
        changedBy,
      },
    });

    return updated;
  }, { maxWait: 10000, timeout: 25000 });
}
