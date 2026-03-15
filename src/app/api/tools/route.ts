import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getToolQrPayload } from "@/lib/tool-qr";
import { toolSchema } from "@/lib/validations/tool";

export async function GET() {
  const tools = await prisma.tool.findMany({
    include: {
      category: true,
      project: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tools);
}

export async function POST(request: Request) {
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
  };

  try {
    const createdTool = await prisma.$transaction(async (transaction) => {
      const pendingQr = `PENDING-${crypto.randomUUID()}`;
      const tool = await transaction.tool.create({
        data: {
          ...data,
          qrCode: pendingQr,
        },
      });

      return transaction.tool.update({
        where: { id: tool.id },
        data: {
          qrCode: getToolQrPayload(tool.id),
        },
      });
    });

    return NextResponse.json(createdTool, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = error.meta?.target;
      const message = Array.isArray(target) && target.includes("inventoryNumber")
        ? "Inventory number already exists"
        : "Unique value already exists";
      return NextResponse.json({ message }, { status: 409 });
    }

    return NextResponse.json({ message: "Failed to create tool" }, { status: 500 });
  }
}
