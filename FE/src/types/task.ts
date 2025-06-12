import type { Employee } from "./employee";

export interface Task {
  title: string;
  description: string;
  deadline: string | null;
  status: TaskStatus;
  assignedTo: string;
  createdBy: string;
  priority: TaskPriority;
}

export interface TaskResponse extends Task {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllTaskResponse extends Omit<TaskResponse, "assignedTo"> {
  assignedTo: Employee;
  avatarUrl: string | null;
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}
