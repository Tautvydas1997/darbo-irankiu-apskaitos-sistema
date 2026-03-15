import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getToolQrPayload } from "@/lib/tool-qr";
import { toolSchema } from "@/lib/validations/tool";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!hasAdminAccess(session?.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = toolSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = {
    ...parsed.data,
    projectId: parsed.data.projectId || null,
    conditionNotes: parsed.data.conditionNotes || null,
    qrCode: getToolQrPayload(context.params.id),
  };

  try {
    const updatedTool = await prisma.tool.update({
      where: { id: context.params.id },
      data,
    });
    return NextResponse.json(updatedTool);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = error.meta?.target;
      const message = Array.isArray(target) && target.includes("inventoryNumber")
        ? "Inventory number already exists"
        : "Unique value already exists";
      return NextResponse.json({ message }, { status: 409 });
    }

    return NextResponse.json({ message: "Failed to update tool" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!hasAdminAccess(session?.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.tool.delete({
      where: { id: context.params.id },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Failed to delete tool" }, { status: 500 });
  }
}
