import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createRazorpayOrderBoundary } from "@/services/payments";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const intent = await createRazorpayOrderBoundary(order.id, order.grandTotal);
    return NextResponse.json(intent);
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
