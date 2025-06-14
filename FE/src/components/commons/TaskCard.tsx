import { type TaskResponse } from "@/types/task";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import TaskStatusBadge from "./TaskStatusBadge";
import { useDraggable } from "@dnd-kit/core";
import type { CSSProperties } from "react";

const TaskCard = ({ task }: { task: TaskResponse }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style: CSSProperties = {
    position: isDragging ? "absolute" : undefined,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? "2px solid #1010105f" : "2px dashed transparent",
    height: "fit-content",
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: 100,
    minWidth: "22vw",
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border h-fit border-gray-200 p-4 mb-4 cursor-grab"
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar />
              {task.deadline
                ? format(new Date(task.deadline), "MM/dd/yyyy")
                : "No deadline"}{" "}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TaskStatusBadge priority={task.priority} />
        </div>
      </div>

      <div className="space-y-4 text-center">
        <p>{task.description}</p>
      </div>
    </div>
  );
};

export default TaskCard;
