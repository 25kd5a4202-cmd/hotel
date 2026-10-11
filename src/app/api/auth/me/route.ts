import { NextResponse } from "next/server";
import { getCurrentUser, COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      addresses: true,
    },
  });

  return NextResponse.json({ user });
}
