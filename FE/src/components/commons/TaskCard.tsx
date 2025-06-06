import { TaskStatus, type Task, type TaskResponse } from "@/types/task";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import TaskStatusBadge from "./TaskStatusBadge";
import { updateEmployeeTask } from "@/services/taskService";
import { useUser } from "@/context/UserContext";

const TaskCard = ({ task }: { task: TaskResponse }) => {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [prevStatus, setPrevStatus] = useState<TaskStatus>(task.status);
  const [error, setError] = useState<string>("");
  const { token } = useUser();
  const statusArr = [
    {
      label: "Pending",
      value: TaskStatus.PENDING,
    },
    {
      label: "In Progress",
      value: TaskStatus.IN_PROGRESS,
    },
    {
      label: "Completed",
      value: TaskStatus.COMPLETED,
    },
  ];

  const handleStatusChange = async (value: TaskStatus) => {
    setPrevStatus(status);
    try {
      setStatus(value);
      await updateEmployeeTask(token, task.id, value);
      setError("");
    } catch (error) {
      console.error("Failed to update task status:", error);
      setError("Failed to update task status. Please try again.");
      setStatus(prevStatus);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar />
              {task.deadline
                ? format(new Date(task.deadline), "MM/dd/yyyy")
                : "No deadline"}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TaskStatusBadge priority={task.priority} />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Select
            value={status}
            onValueChange={(value) => handleStatusChange(value as TaskStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a task status" />
            </SelectTrigger>
            <SelectContent>
              {statusArr.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-4">
        <p>{task.description}</p>
      </div>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
};

export default TaskCard;
