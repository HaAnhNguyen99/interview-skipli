import { useUser } from "@/context/UserContext";
import TaskCard from "../commons/TaskCard";
import { useEffect, useState } from "react";
import { TaskStatus, type TaskResponse } from "@/types/task";
import { getEmployeeTasks, updateEmployeeTask } from "@/services/taskService";
import { closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import axios from "axios";

const columns = [
  TaskStatus.PENDING,
  TaskStatus.IN_PROGRESS,
  TaskStatus.COMPLETED,
];

const TaskColumn = ({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: TaskResponse[];
}) => {
  const { setNodeRef } = useDroppable({ id });

  const getTitleColor = (title: string) => {
    if (title === TaskStatus.PENDING.replace("_", " ").toUpperCase())
      return "bg-yellow-100 text-yellow-800";
    if (title === TaskStatus.IN_PROGRESS.replace("_", " ").toUpperCase())
      return "bg-blue-100 text-blue-800";
    if (title === TaskStatus.COMPLETED.replace("_", " ").toUpperCase())
      return "bg-green-100 text-green-800";
  };

  return (
    <div
      ref={setNodeRef}
      className="border-2 border-gray-600 border-dashed rounded-md pb-2 h-[70vh]  scrollable-element px-2">
      <p
        className={`py-4 text-center text-2xl font-bold mb-2 sticky rounded-lg shadow-md  top-0 ${getTitleColor(
          title
        )}`}>
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white mr-2 p-1">
            <div className="w-full h-full rounded-full bg-gray-600"></div>
          </div>
          {title}
        </div>
      </p>

      <div>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);

  const { user, token } = useUser();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getEmployeeTasks(token, user?.employeeId || "");
        setTasks(response.data.tasks);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data.msg);
        } else {
          alert("An error occurred while fetching tasks");
        }
      }
    };
    fetchTasks();
  }, [token, user?.employeeId]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const newStatus = over.id as TaskStatus;

    const updatedTasks = tasks.map((t) =>
      t.id === activeId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);
    try {
      await updateEmployeeTask(token, activeId.toString(), newStatus);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.msg);
      } else {
        alert("Failed to update task status");
      }
      setTasks(tasks);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <TaskColumn
              key={column}
              id={column}
              title={column.replace("_", " ").toUpperCase()}
              tasks={tasks.filter((t) => t.status === column)}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default EmployeeDashboard;
