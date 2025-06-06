import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/commons/ui/dialog";
import { Button } from "../commons/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "../commons/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/commons/ui/select";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { taskSchema } from "@/schemas/taskSchema";
import { TaskPriority, TaskStatus, type Task } from "@/types/task";
import type { Employee } from "@/types/employee";
import { getAllEmployees } from "@/services/employeeApi";
import { DatePickerComponent } from "../commons/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createTask } from "@/services/taskService";
import axios from "axios";
import { redirect } from "react-router-dom";

const AddTask = ({ onAdd }: { onAdd: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [createdBy, setCreatedBy] = useState<string>("");

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.PENDING,
      assignedTo: "",
      createdBy,
      priority: TaskPriority.LOW,
      deadline: null,
    } as Task,
  });

  const { user, token } = useUser();

  useEffect(() => {
    if (user?.phoneNumber) {
      form.reset({
        ...form.getValues(),
        createdBy: user.phoneNumber,
      });
    }

    const fetchEmployees = async () => {
      try {
        const employeesResult = await getAllEmployees(token || "");
        setEmployees(employeesResult.data.employees);
        setCreatedBy(user?.phoneNumber || "");
      } catch (err) {
        console.error("Failed to get employees:", err);
        setError("Failed to load employees. Please try again.");
      }
    };
    fetchEmployees();
  }, [token, user?.phoneNumber, form]);

  const onSubmit = async (data: Task) => {
    console.log(data);

    try {
      setIsLoading(true);
      form.reset();
      if (!token || token === "") {
        alert("Please login again!");
        redirect("/");
      }

      await createTask(token || "", {
        ...data,
      });
      onAdd();
      setIsOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 401) {
          alert("Your session has expired. Please log in again.");
          redirect("/");
        }

        if (err.status === 400) {
          setError(err.response?.data?.msg + ". Please try again");
        } else {
          alert("An error occurred. Please try again later.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3">
        <PlusIcon />
        Add Task
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>Add a new task to the system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
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
                            {statusArr.map((status) => (
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
            </div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <Button
              type="submit"
              className="w-full mt-3 active:scale-[0.99] active:duration-75"
              disabled={isLoading}>
              {isLoading ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTask;
