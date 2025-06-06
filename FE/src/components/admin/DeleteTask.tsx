import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../commons/ui/popover";
import { Button } from "../commons/ui/button";
import { TrashIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { deleteTask } from "@/services/taskService";

const DeleteTask = ({
  onDelete,
  taskId,
}: {
  onDelete: () => void;
  taskId: string;
}) => {
  const [open, setOpen] = useState(false);
  const { token } = useUser();

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(token, taskId);
      onDelete();
      setOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="destructive">
          <TrashIcon />
          Delete
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 flex flex-col items-center">
        <div className="mb-2 text-center">Are you sure you want to delete?</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(taskId)}>
            Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteTask;
