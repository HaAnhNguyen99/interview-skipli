import { TaskPriority, TaskStatus } from "@/types/task";
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(
    [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED],
    {
      message: "Invalid status",
    }
  ),
  assignedTo: z
    .string({
      message: "Assigned to is required",
    })
    .min(1, "Assigned field is required"),
  createdBy: z.string().min(1, "Created by is required"),
  deadline: z.string().nullable(),
  priority: z.enum(
    [
      TaskPriority.LOW,
      TaskPriority.MEDIUM,
      TaskPriority.HIGH,
      TaskPriority.URGENT,
    ],
    {
      message: "Invalid priority",
    }
  ),
});

export type Task = z.infer<typeof taskSchema>;

export type TaskFormData = Omit<z.infer<typeof taskSchema>, "status">;

export type TaskUpdateFormData = Partial<TaskFormData>;
