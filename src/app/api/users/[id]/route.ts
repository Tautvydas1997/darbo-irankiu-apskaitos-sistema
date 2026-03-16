import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { updateEmployeeUserSchema } from "@/lib/validations/user";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!hasAdminAccess(session?.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateEmployeeUserSchema.safeParse(body);
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
    const updatedUser = await prisma.employeeUser.update({
      where: { id: context.params.id },
      data,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "Employee ID already exists", fieldErrors: { employeeId: ["Employee ID already exists"] } },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!hasAdminAccess(session?.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.employeeUser.delete({
      where: { id: context.params.id },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
