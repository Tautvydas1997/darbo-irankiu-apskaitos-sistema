import { ActionType, ToolStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  action: z.enum(["CHECK_OUT", "RETURN", "REPORT_BROKEN"]),
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  projectCode: z.string().trim().toUpperCase().regex(/^P\d{4}$/, "Project code must match format P2652"),
  notes: z.string().trim().max(500).optional().nullable(),
});

type RouteContext = {
  params: { id: string };
};

function mapActionToStatus(action: ActionType): ToolStatus {
  switch (action) {
    case "CHECK_OUT":
      return "CHECKED_OUT";
    case "RETURN":
      return "IN_STORAGE";
    case "REPORT_BROKEN":
      return "BROKEN";
  }
}

const ALLOWED_CURRENT_STATUSES: Record<ActionType, ToolStatus[]> = {
  CHECK_OUT: ["IN_STORAGE"],
  RETURN: ["CHECKED_OUT", "BROKEN"],
  REPORT_BROKEN: ["CHECKED_OUT"],
};

export async function PATCH(request: Request, context: RouteContext) {
  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const tool = await prisma.tool.findUnique({
    where: { id: context.params.id },
    select: { id: true },
  });
  if (!tool) {
    return NextResponse.json({ message: "Tool not found" }, { status: 404 });
  }
  const project = await prisma.project.findUnique({
    where: { code: parsed.data.projectCode },
    select: { id: true, code: true },
  });

  const nextStatus = mapActionToStatus(parsed.data.action);
  const allowedCurrentStatuses = ALLOWED_CURRENT_STATUSES[parsed.data.action];

  try {
    await prisma.$transaction(async (transaction) => {
      const currentTool = await transaction.tool.findUnique({
        where: { id: context.params.id },
        select: { projectId: true },
      });
      if (!currentTool) {
        throw new Error("TOOL_NOT_FOUND");
      }

      const nextProjectId =
        parsed.data.action === "RETURN"
          ? null
          : project?.id ?? currentTool.projectId ?? null;

      const updateResult = await transaction.tool.updateMany({
        where: {
          id: context.params.id,
          status: { in: allowedCurrentStatuses },
        },
        data: {
          status: nextStatus,
          projectId: nextProjectId,
        },
      });
      if (updateResult.count === 0) {
        throw new Error("INVALID_STATUS_TRANSITION");
      }

      await transaction.toolTransaction.create({
        data: {
          toolId: context.params.id,
          projectId: project?.id ?? null,
          projectCode: parsed.data.projectCode,
          employeeFirstName: parsed.data.firstName,
          employeeLastName: parsed.data.lastName,
          actionType: parsed.data.action,
          notes: parsed.data.notes ?? `Quick action from mobile tool page: ${parsed.data.action}`,
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TOOL_NOT_FOUND") {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "INVALID_STATUS_TRANSITION") {
      return NextResponse.json(
        {
          message:
            parsed.data.action === "CHECK_OUT"
              ? "Tool is already taken. Return it to warehouse before taking it again."
              : "Action is not allowed in current tool status.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Quick action failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
