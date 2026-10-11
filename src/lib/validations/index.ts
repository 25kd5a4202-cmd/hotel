import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  selectedAddOnIds: z.array(z.string()).default([]),
  quantity: z.number().int().min(1).max(50),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().min(10, "10-digit phone number required"),
  orderType: z.enum(["DELIVERY", "PICKUP"]).default("DELIVERY"),
  deliveryAddress: z
    .object({
      street: z.string().min(3, "Street address required"),
      landmark: z.string().optional(),
      city: z.string().min(2, "City required"),
      state: z.string().min(2, "State required"),
      postalCode: z.string().min(5, "Postal code required"),
    })
    .optional(),
  paymentMethod: z.enum(["COD", "RAZORPAY", "ONLINE"]).default("COD"),
  couponCode: z.string().optional(),
  notes: z.string().max(300).optional(),
  items: z.array(checkoutItemSchema).min(1, "Cart cannot be empty"),
  idempotencyKey: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "READY_FOR_PICKUP",
    "COMPLETED",
    "CANCELLED",
  ]),
  notes: z.string().optional(),
});

export const couponValidationSchema = z.object({
  code: z.string().min(2),
  subtotal: z.number().int().min(0),
});
