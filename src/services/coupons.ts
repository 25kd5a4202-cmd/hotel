import prisma from "@/lib/db";
import { DiscountType } from "@prisma/client";

export async function validateCoupon(code: string, subtotal: number) {
  const normalizedCode = code.trim().toUpperCase();
  const coupon = await prisma.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon || !coupon.isActive) {
    return { valid: false, error: "Invalid or inactive coupon code" };
  }

  const now = new Date();
  if (coupon.validFrom > now || coupon.validUntil < now) {
    return { valid: false, error: "This coupon has expired" };
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, error: "Coupon usage limit reached" };
  }

  if (subtotal < coupon.minOrderAmount) {
    const minMajor = (coupon.minOrderAmount / 100).toFixed(0);
    return {
      valid: false,
      error: `Minimum order amount of ₹${minMajor} required for this coupon`,
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === DiscountType.PERCENTAGE) {
    discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  discountAmount = Math.min(subtotal, discountAmount);

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
    },
  };
}
