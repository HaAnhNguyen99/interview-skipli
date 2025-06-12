import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/commons/ui/dialog";
import { Button } from "../commons/ui/button";
import { EditIcon } from "lucide-react";
import { Label } from "../commons/ui/label";
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
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import type { Employee } from "@/types/employee";
import { updateEmployee } from "@/services/employeeApi";
import { employeeSchema, type EmployeeFormData } from "@/schemas/employee";
import { redirect } from "react-router-dom";

interface EditEmployeeProps {
  employee: Employee;
  onUpdated: () => void;
}
const EditEmployee = ({ employee, onUpdated }: EditEmployeeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const { user, token } = useUser();

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      role: employee.role as EmployeeFormData["role"],
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true);
    if (!token || !user?.employeeId) {
      alert("Please login again!");
      redirect("/");
      return;
    }
    try {
      await updateEmployee(token, employee.id, { ...data });
      setError("");
      onUpdated();
      setIsOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 401) {
          alert("Your session has expired. Please log in again.");
        } else {
          alert("An error occurred. Please try again later.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3">
        <EditIcon />
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Update employee information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            {/* Phone Number and Role */}
            {form.formState.errors.phoneNumber && (
              <p className="text-red-500">
                {form.formState.errors.phoneNumber.message}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {/* Phone Number */}
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  type="text"
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                />
              </div>
              {/* Role */}
              <div className="grid gap-2 w-full">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue(
                      "role",
                      value as z.infer<typeof employeeSchema>["role"],
                      {
                        shouldValidate: true,
                      }
                    )
                  }
                  defaultValue={employee.role}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full mt-3" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Employee"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployee;
