import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createEmployeeUserSchema } from "@/lib/validations/user";

export async function GET() {
  const session = await getAuthSession();
  if (!hasAdminAccess(session?.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.employeeUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!hasAdminAccess(session?.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createEmployeeUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = {
    ...parsed.data,
    employeeId: parsed.data.employeeId.toUpperCase(),
  };

  try {
    const createdUser = await prisma.employeeUser.create({ data });
    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "Employee ID already exists", fieldErrors: { employeeId: ["Employee ID already exists"] } },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
  }
}
