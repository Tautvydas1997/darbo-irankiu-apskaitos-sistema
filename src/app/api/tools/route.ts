import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getNextInventoryNumber } from "@/lib/inventory-number";
import { hasAdminAccess } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getToolQrPayload } from "@/lib/tool-qr";
import { createToolSchema } from "@/lib/validations/tool";

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
  const parsed = createToolSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const requestedInventoryNumber = parsed.data.inventoryNumber?.trim() || null;

  const data = {
    ...parsed.data,
    inventoryNumber: requestedInventoryNumber ?? "",
    projectId: parsed.data.projectId || null,
    conditionNotes: parsed.data.conditionNotes || null,
  };

  try {
    const createdTool = await prisma.$transaction(async (transaction) => {
      const createToolWithInventoryNumber = async (inventoryNumber: string) => {
        const pendingQr = `PENDING-${crypto.randomUUID()}`;
        const tool = await transaction.tool.create({
          data: {
            ...data,
            inventoryNumber,
            qrCode: pendingQr,
          },
        });

        return transaction.tool.update({
          where: { id: tool.id },
          data: {
            qrCode: getToolQrPayload(tool.id),
          },
        });
      };

      if (requestedInventoryNumber) {
        return createToolWithInventoryNumber(requestedInventoryNumber);
      }

      for (let attempt = 0; attempt < 20; attempt += 1) {
        const nextInventoryNumber = await getNextInventoryNumber(transaction);
        try {
          return await createToolWithInventoryNumber(nextInventoryNumber);
        } catch (error) {
          const isInventoryConflict =
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002" &&
            Array.isArray(error.meta?.target) &&
            error.meta.target.includes("inventoryNumber");
          if (isInventoryConflict) {
            continue;
          }
          throw error;
        }
      }

      throw new Error("INVENTORY_NUMBER_GENERATION_FAILED");
    });

    return NextResponse.json(createdTool, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "INVENTORY_NUMBER_GENERATION_FAILED") {
      return NextResponse.json({ message: "Failed to generate inventory number" }, { status: 500 });
    }

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
