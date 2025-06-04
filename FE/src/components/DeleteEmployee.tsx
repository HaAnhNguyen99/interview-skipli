import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { deleteEmployee } from "@/services/employeeApi";
import { useUser } from "@/context/UserContext";
import { TrashIcon } from "lucide-react";
export default function DeleteEmployee({
  onDelete,
  employeeId,
}: {
  onDelete: () => void;
  employeeId: string;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const handleDelete = async () => {
    try {
      await deleteEmployee(user?.token || "", employeeId);
      onDelete();
      setOpen(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
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
            onClick={() => handleDelete()}>
            Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
