import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: { where: { isAvailable: true } } },
      },
    },
  });
}

export async function getProducts(options?: {
  categorySlug?: string;
  isVeg?: boolean;
  search?: string;
  featured?: boolean;
}) {
  const where: Prisma.ProductWhereInput = {
    isAvailable: true,
  };

  if (options?.categorySlug && options.categorySlug !== "all") {
    where.category = { slug: options.categorySlug };
  }

  if (options?.isVeg !== undefined) {
    where.isVeg = options.isVeg;
  }

  if (options?.featured) {
    where.isFeatured = true;
  }

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { description: { contains: options.search, mode: "insensitive" } },
    ];
  }

  return prisma.product.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { where: { isAvailable: true }, orderBy: { priceModifier: "asc" } },
      addOnGroups: {
        include: {
          options: { where: { isAvailable: true }, orderBy: { price: "asc" } },
        },
      },
      _count: {
        select: { reviews: { where: { isApproved: true } } },
      },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { where: { isAvailable: true }, orderBy: { priceModifier: "asc" } },
      addOnGroups: {
        include: {
          options: { where: { isAvailable: true }, orderBy: { price: "asc" } },
        },
      },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getFeaturedDishes() {
  return prisma.product.findMany({
    where: { isAvailable: true, isFeatured: true },
    take: 6,
    include: {
      category: true,
      variants: { where: { isAvailable: true } },
      addOnGroups: {
        include: {
          options: { where: { isAvailable: true } },
        },
      },
      _count: {
        select: { reviews: true },
      },
    },
  });
}
