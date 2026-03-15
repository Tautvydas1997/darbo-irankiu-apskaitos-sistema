import { z } from "zod";

export const projectSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^P\d{4}$/, "Code must match format P2652"),
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  location: z.string().trim().min(2, "Location must be at least 2 characters"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
