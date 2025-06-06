import { useUser } from "@/context/UserContext";
import TaskCard from "../commons/TaskCard";
import { useEffect, useState } from "react";
import type { TaskResponse } from "@/types/task";
import { getEmployeeTasks } from "@/services/taskService";

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const { user, token } = useUser();
  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getEmployeeTasks(token, user?.employeeId || "");
      setTasks(tasks.data.tasks);
      console.log(tasks.data.tasks);
    };
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
