import crypto from "crypto";
import prisma from "@/lib/db";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

export function isRazorpayConfigured(): boolean {
  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_ID !== "rzp_test_placeholder_key" &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_KEY_SECRET !== "placeholder_secret_key"
  );
}

export async function createRazorpayOrderBoundary(orderId: string, amountInCents: number) {
  if (!isRazorpayConfigured()) {
    // Graceful simulation / sandbox boundary mode when keys are placeholder
    const mockRazorpayOrderId = `order_rzp_mock_${Date.now()}`;
    await prisma.payment.updateMany({
      where: { orderId },
      data: {
        providerOrderId: mockRazorpayOrderId,
      },
    });

    return {
      configured: false,
      razorpayOrderId: mockRazorpayOrderId,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
      amount: amountInCents,
      currency: "INR",
      message: "Razorpay test mode active (using sandbox simulation).",
    };
  }

  // Real Razorpay API call
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amountInCents,
      currency: "INR",
      receipt: orderId.substring(0, 40),
      notes: { orderId },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Razorpay order creation failed: ${errorText}`);
  }

  const razorpayOrder = await res.json();

  await prisma.payment.updateMany({
    where: { orderId },
    data: {
      providerOrderId: razorpayOrder.id,
    },
  });

  return {
    configured: true,
    razorpayOrderId: razorpayOrder.id,
    keyId: process.env.RAZORPAY_KEY_ID!,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
}

export async function verifyPaymentSignature(params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  if (!isRazorpayConfigured()) {
    // In mock/sandbox mode
    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { orderId: params.orderId },
        data: {
          status: PaymentStatus.PAID,
          providerPaymentId: params.razorpayPaymentId,
          providerSignature: params.razorpaySignature,
          transactionId: params.razorpayPaymentId,
        },
      }),
      prisma.order.update({
        where: { id: params.orderId },
        data: { paymentStatus: PaymentStatus.PAID },
      }),
    ]);
    return { verified: true, sandbox: true };
  }

  // Server-side HMAC SHA256 verification
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== params.razorpaySignature) {
    await prisma.payment.updateMany({
      where: { orderId: params.orderId },
      data: {
        status: PaymentStatus.FAILED,
        failureReason: "Payment signature mismatch",
      },
    });
    return { verified: false, error: "Invalid payment signature" };
  }

  // Mark paid
  await prisma.$transaction([
    prisma.payment.updateMany({
      where: { orderId: params.orderId },
      data: {
        status: PaymentStatus.PAID,
        providerPaymentId: params.razorpayPaymentId,
        providerSignature: params.razorpaySignature,
        transactionId: params.razorpayPaymentId,
      },
    }),
    prisma.order.update({
      where: { id: params.orderId },
      data: { paymentStatus: PaymentStatus.PAID },
    }),
  ]);

  return { verified: true, sandbox: false };
}
