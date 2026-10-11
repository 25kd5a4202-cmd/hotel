import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone,
        passwordHash,
        role: Role.CUSTOMER,
      },
    });

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
