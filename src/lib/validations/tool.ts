import { ToolStatus } from "@prisma/client";
import { z } from "zod";

const baseToolSchema = {
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  status: z.nativeEnum(ToolStatus),
  categoryId: z.string().trim().min(1, "Category is required"),
  projectId: z.string().trim().optional().nullable(),
  conditionNotes: z.string().trim().max(1000, "Condition notes are too long").optional().nullable(),
};

export const createToolSchema = z.object({
  ...baseToolSchema,
  inventoryNumber: z.string().trim().optional().nullable(),
});

export const updateToolSchema = z.object({
  ...baseToolSchema,
  inventoryNumber: z.string().trim().min(1, "Inventory number is required"),
});

// Backward-compatible alias for existing imports expecting toolSchema.
export const toolSchema = updateToolSchema;

export type ToolInput = z.infer<typeof toolSchema>;
