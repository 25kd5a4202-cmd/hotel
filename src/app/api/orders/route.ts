import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations";
import { createOrderTransaction } from "@/services/orders";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid checkout request", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const session = await getCurrentUser();
    const order = await createOrderTransaction({
      ...result.data,
      userId: session?.id,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        grandTotal: order.grandTotal,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    const message = error instanceof Error ? error.message : "Failed to place order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
