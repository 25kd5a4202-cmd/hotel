import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumberOrId } from "@/services/orders";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderByNumberOrId(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Fetch order error:", error);
    return NextResponse.json({ error: "Failed to load order" }, { status: 500 });
  }
}
