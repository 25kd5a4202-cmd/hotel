import prisma from "@/lib/db";

export async function getRestaurantSettings() {
  const settings = await prisma.restaurantSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    return prisma.restaurantSettings.create({
      data: {
        id: "default",
        name: "Antigravity Bistro & Kitchen",
        phone: "+91 98765 43210",
        email: "orders@antigravitybistro.com",
        address: "104 Gourmet Square, Tech Boulevard, Silicon District",
        isOpen: true,
        deliveryRadiusKm: 15.0,
        minOrderAmount: 19900,
        deliveryFee: 4000,
        freeDeliveryThreshold: 50000,
        taxPercentage: 5.0,
        openingHour: "10:00",
        closingHour: "23:00",
        currencySymbol: "₹",
        currencyCode: "INR",
      },
    });
  }

  return settings;
}

export async function updateRestaurantSettings(data: {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  isOpen?: boolean;
  minOrderAmount?: number;
  deliveryFee?: number;
  freeDeliveryThreshold?: number;
  taxPercentage?: number;
  openingHour?: string;
  closingHour?: string;
}) {
  return prisma.restaurantSettings.upsert({
    where: { id: "default" },
    update: data,
    create: {
      id: "default",
      ...data,
    },
  });
}
