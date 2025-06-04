import { z } from "zod";

export const employeeSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["sales", "marketing", "hr", "it", "finance"], {
    message: "Invalid role",
  }),
  phoneNumber: z.string().length(10, "Invalid phone number"),
  name: z.string().min(1, "Name is required"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
