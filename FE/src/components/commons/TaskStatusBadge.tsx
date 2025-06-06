import { Badge } from "./ui/badge";
import { TaskPriority } from "@/types/task";

const TaskStatusBadge = ({ priority }: { priority: TaskPriority }) => {
  return (
    <div>
      {priority === TaskPriority.LOW ? (
        <Badge
          variant="default"
          className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Low
        </Badge>
      ) : priority === TaskPriority.MEDIUM ? (
        <Badge
          variant="default"
          className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Medium
        </Badge>
      ) : (
        <Badge
          variant="default"
          className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          High
        </Badge>
      )}
    </div>
  );
};

export default TaskStatusBadge;
