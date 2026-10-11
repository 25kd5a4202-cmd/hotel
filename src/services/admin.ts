import prisma from "@/lib/db";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

export async function getAdminKPIs() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    todayOrders,
    pendingCount,
    preparingCount,
    outForDeliveryCount,
    completedToday,
    totalProducts,
    allOrdersToday,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { status: OrderStatus.PREPARING } }),
    prisma.order.count({ where: { status: OrderStatus.OUT_FOR_DELIVERY } }),
    prisma.order.count({
      where: { status: OrderStatus.COMPLETED, createdAt: { gte: startOfDay } },
    }),
    prisma.product.count(),
    prisma.order.findMany({
      where: {
        createdAt: { gte: startOfDay },
        paymentStatus: PaymentStatus.PAID,
      },
      select: { grandTotal: true },
    }),
  ]);

  const todayRevenue = allOrdersToday.reduce((acc, curr) => acc + curr.grandTotal, 0);

  return {
    todayOrders,
    todayRevenue,
    pendingCount,
    preparingCount,
    outForDeliveryCount,
    completedToday,
    totalProducts,
    activeOrdersCount: pendingCount + preparingCount + outForDeliveryCount,
  };
}

export async function getAdminOrders(options?: {
  status?: OrderStatus;
  search?: string;
  limit?: number;
}) {
  const where: Prisma.OrderWhereInput = {};

  if (options?.status) {
    where.status = options.status;
  }

  if (options?.search) {
    where.OR = [
      { orderNumber: { contains: options.search, mode: "insensitive" } },
      { customerName: { contains: options.search, mode: "insensitive" } },
      { customerPhone: { contains: options.search, mode: "insensitive" } },
    ];
  }

  return prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: options?.limit || 50,
    include: {
      items: true,
      payments: true,
      statusHistory: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function getTopSellingProducts(limit = 5) {
  const grouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true, totalPrice: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const productIds = grouped.map((g) => g.productId).filter((id): id is string => Boolean(id));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, image: true, basePrice: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return grouped.map((item) => ({
    productId: item.productId,
    product: item.productId ? productMap.get(item.productId) : null,
    totalQuantity: item._sum.quantity || 0,
    totalRevenue: item._sum.totalPrice || 0,
  }));
}
