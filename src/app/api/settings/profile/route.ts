import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const bodySchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Email is invalid"),
    language: z.enum(["lt", "en"]),
    currentPassword: z.string().optional().default(""),
    newPassword: z.string().optional().default(""),
  })
  .superRefine((value, context) => {
    const wantsPasswordChange = value.currentPassword.trim().length > 0 || value.newPassword.trim().length > 0;
    if (!wantsPasswordChange) {
      return;
    }

    if (value.currentPassword.trim().length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentPassword"],
        message: "Current password is required",
      });
    }

    if (value.newPassword.trim().length < 8) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "New password must be at least 8 characters",
      });
    }
  });

export async function PATCH(request: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      password: true,
    },
  });
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const wantsPasswordChange =
    parsed.data.currentPassword.trim().length > 0 || parsed.data.newPassword.trim().length > 0;
  if (wantsPasswordChange) {
    const validPassword = await verifyPassword(parsed.data.currentPassword.trim(), admin.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Validation failed", fieldErrors: { currentPassword: ["Current password is incorrect"] } },
        { status: 400 }
      );
    }
  }

  try {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        language: parsed.data.language,
        ...(wantsPasswordChange ? { password: await hashPassword(parsed.data.newPassword.trim()) } : {}),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "Email already exists", fieldErrors: { email: ["Email already exists"] } },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true, nextLanguage: parsed.data.language });
  response.cookies.set("locale", parsed.data.language, {
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
