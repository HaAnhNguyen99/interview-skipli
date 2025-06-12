import { useUser } from "@/context/UserContext";
import {
  TaskPriority,
  TaskStatus,
  type AllTaskResponse,
  type Task,
} from "@/types/task";
import { useEffect, useState } from "react";
import { Button } from "../commons/ui/button";
import {
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "../commons/ui/dialog";
import { Dialog } from "../commons/ui/dialog";
import type { Employee } from "@/types/employee";
import { getAllEmployees } from "@/services/employeeApi";
import { DatePickerComponent } from "../commons/ui/date-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/commons/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { taskSchema } from "@/schemas/taskSchema";
import { Input } from "../commons/ui/input";
import type { z } from "zod";
import { updateTask } from "@/services/taskService";
import { redirect } from "react-router-dom";
import axios from "axios";

const EditTask = ({
  onUpdate,
  task,
}: {
  onUpdate: () => void;
  task: AllTaskResponse;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo.id,
      createdBy: task.createdBy,
      priority: task.priority,
      deadline: task.deadline,
    } as Task,
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = form;

  const { user, token } = useUser();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesResult = await getAllEmployees(token || "");
        setEmployees(employeesResult.data.employees);
      } catch (err) {
        console.error("Failed to get employees:", err);
        setError("Failed to load employees. Please try again.");
      }
    };
    fetchEmployees();
  }, [token, user?.phoneNumber, form]);

  const onSubmit = async (data: Task) => {
    console.log("FORM DATA", data);
    setIsLoading(true);
    try {
      await updateTask(token, task.id, data);
      onUpdate();
      setIsOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 401) {
          alert("Your session has expired. Please log in again.");
          redirect("/");
        }

        setError(
          err.response?.data?.msg ||
            "An error occurred. Please try again later."
        );
      }
      console.error("Failed to update task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.log("FORM ERROR", errors);
            })}>
            <div className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Description */}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Phone Number and Role */}
              <div className="grid gap-2 grid-cols-2">
                {/* Assigned To */}
                <div className="grid gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem
                                key={employee.id}
                                value={employee.id.toString()}>
                                {employee.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Deadline */}
                <div className="grid gap-2 w-full">
                  <div className="w-full">
                    <DatePickerComponent form={form} />
                  </div>
                </div>
              </div>

              {/* Priority & Status*/}
              <div className="grid gap-2 grid-cols-2">
                {/* Priority */}
                <div className="grid gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              TaskPriority.LOW,
                              TaskPriority.MEDIUM,
                              TaskPriority.HIGH,
                              TaskPriority.URGENT,
                            ].map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priority}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status */}
                <div className="grid gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { label: "Pending", value: TaskStatus.PENDING },
                              {
                                label: "In Progress",
                                value: TaskStatus.IN_PROGRESS,
                              },
                              {
                                label: "Completed",
                                value: TaskStatus.COMPLETED,
                              },
                            ].map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {form.formState.errors.status && (
                <p className="text-red-500 text-right">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <Button
              type="submit"
              className="w-full mt-3 active:scale-[0.99] active:duration-75"
              disabled={isLoading || !isDirty}>
              {isLoading ? "Updating..." : "Update Task"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
