import { z } from "zod";

const employeeIdSchema = z
  .string()
  .trim()
  .min(3, "Employee ID must be at least 3 characters")
  .max(32, "Employee ID is too long")
  .regex(/^[A-Z0-9_-]+$/, "Employee ID may contain only letters, numbers, _ and -");

export const createEmployeeUserSchema = z.object({
  employeeId: employeeIdSchema,
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  isActive: z.boolean().default(true),
});

export const updateEmployeeUserSchema = createEmployeeUserSchema;

export type EmployeeUserInput = z.infer<typeof createEmployeeUserSchema>;
