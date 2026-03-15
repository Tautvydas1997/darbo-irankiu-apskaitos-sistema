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
    select: { id: true, projectId: true },
  });
  if (!tool) {
    return NextResponse.json({ message: "Tool not found" }, { status: 404 });
  }
  const project = await prisma.project.findUnique({
    where: { code: parsed.data.projectCode },
    select: { id: true, code: true },
  });

  const nextStatus = mapActionToStatus(parsed.data.action);

  await prisma.$transaction(async (transaction) => {
    const nextProjectId =
      parsed.data.action === "RETURN"
        ? null
        : project?.id ?? tool.projectId ?? null;

    await transaction.tool.update({
      where: { id: context.params.id },
      data: {
        status: nextStatus,
        projectId: nextProjectId,
      },
    });

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

  return NextResponse.json({ ok: true });
}
