import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateOrderStatusSchema } from "@/lib/validations";
import { updateOrderStatus } from "@/services/orders";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = updateOrderStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid status transition", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(
      id,
      result.data.status,
      result.data.notes,
      `${session.name} (${session.role})`
    );

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Order status update error:", error);
    const message = error instanceof Error ? error.message : "Failed to update order status";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
