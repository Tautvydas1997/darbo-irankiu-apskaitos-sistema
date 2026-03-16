import { NextResponse } from "next/server";
import { z } from "zod";
import { clearScannerSessionCookie, setScannerSessionCookie } from "@/lib/employee-auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(3, "Employee ID is required")
    .max(32, "Employee ID is too long")
    .regex(/^[A-Za-z0-9_-]+$/, "Employee ID format is invalid"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const employeeId = parsed.data.employeeId.toUpperCase();
  const employee = await prisma.employeeUser.findUnique({
    where: { employeeId },
    select: {
      id: true,
      employeeId: true,
      firstName: true,
      lastName: true,
      isActive: true,
    },
  });
  if (!employee || !employee.isActive) {
    return NextResponse.json({ message: "Invalid employee ID" }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    employee: {
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
    },
  });
  setScannerSessionCookie(response, {
    employeeUserId: employee.id,
    employeeId: employee.employeeId,
    firstName: employee.firstName,
    lastName: employee.lastName,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearScannerSessionCookie(response);
  return response;
}
