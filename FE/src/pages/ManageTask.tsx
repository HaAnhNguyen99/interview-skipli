import { useCallback, useEffect, useState } from "react";
import AddTask from "../components/admin/AddTask";
import { TaskStatus, type AllTaskResponse } from "@/types/task";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/commons/ui/table";
import { getTasks } from "@/services/taskService";
import { useUser } from "@/context/UserContext";
import { Badge } from "../components/commons/ui/badge";
import EditTask from "../components/admin/EditTask";
import DeleteTask from "../components/admin/DeleteTask";
import TaskStatusBadge from "../components/commons/TaskStatusBadge";
import Loading from "@/components/commons/loading/loading";

const ManageTask = () => {
  const [tasks, setTasks] = useState<AllTaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useUser();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getTasks(token);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );

  console.log(
    tasks.forEach((task) => {
      console.log(task.avatarUrl);
    })
  );
  return (
    <div className="mt-10 px-10">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wider">Manage Task</h1>
        <div>
          <AddTask
            onAdd={() => {
              fetchTasks();
            }}
          />
        </div>
      </header>
      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-900 my-2">Recent Tasks</h2>
        <div>
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow className="*:text-gray-500 uppercase tracking-wider">
                <TableHead>Task</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Asigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <p className="font-medium">{task.title}</p>
                      <p>{task.description}</p>
                    </TableCell>
                    <TableCell>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </TableCell>
                    <TableCell className="capitalize">
                      {task.status === TaskStatus.COMPLETED ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 text-white">
                          Active
                        </Badge>
                      ) : task.status === TaskStatus.IN_PROGRESS ? (
                        <Badge
                          variant="default"
                          className="bg-blue-500 text-white">
                          In Progress
                        </Badge>
                      ) : (
                        <Badge
                          variant="default"
                          className="bg-yellow-500 text-white">
                          Pending
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="flex items-center gap-2">
                      {task.avatarUrl && (
                        <img
                          src={task.avatarUrl}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      )}

                      <p>{task.assignedTo.name}</p>
                    </TableCell>
                    <TableCell className="capitalize">
                      <TaskStatusBadge priority={task.priority} />
                    </TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <EditTask
                        onUpdate={() => {
                          fetchTasks();
                        }}
                        task={task}
                      />
                      <DeleteTask
                        onDelete={() => {
                          fetchTasks();
                        }}
                        taskId={task.id}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ManageTask;
