import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/services/coupons";
import { couponValidationSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = couponValidationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { code, subtotal } = result.data;
    const validation = await validateCoupon(code, subtotal);

    if (!validation.valid) {
      return NextResponse.json({ valid: false, error: validation.error }, { status: 400 });
    }

    return NextResponse.json(validation);
  } catch (error) {
    console.error("Coupon API error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
