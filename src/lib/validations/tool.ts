import { ToolStatus } from "@prisma/client";
import { z } from "zod";

export const toolSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  inventoryNumber: z.string().trim().min(1, "Inventory number is required"),
  status: z.nativeEnum(ToolStatus),
  categoryId: z.string().trim().min(1, "Category is required"),
  projectId: z.string().trim().optional().nullable(),
  conditionNotes: z.string().trim().max(1000, "Condition notes are too long").optional().nullable(),
});

export type ToolInput = z.infer<typeof toolSchema>;
