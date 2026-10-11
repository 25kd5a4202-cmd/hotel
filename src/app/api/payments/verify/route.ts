import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/services/payments";

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing required payment details" }, { status: 400 });
    }

    const verification = await verifyPaymentSignature({
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!verification.verified) {
      return NextResponse.json({ error: verification.error || "Payment verification failed" }, { status: 400 });
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
