import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/commons/ui/dialog";
import { Input } from "@/components/commons/ui/input";
import { Label } from "@/components/commons/ui/label";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  employeeProfileSchema,
  type EmployeeProfileFormData,
} from "@/schemas/employee";
import { updateEmployeeProfile } from "@/services/employeeApi";
import axios from "axios";
import type { Employee } from "@/types/employee";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, updateUser, token } = useUser();

  const form = useForm<EmployeeProfileFormData>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = form;

  if (!user) return null;

  const onSubmit = async (data: EmployeeProfileFormData) => {
    setLoading(true);
    console.log(true);
    if (!token || !user.employeeId) {
      alert("Please login again!");
      return;
    }
    try {
      const res = await updateEmployeeProfile(token, user.employeeId, {
        role: user?.role as Employee["role"],
        ...data,
      });

      updateUser(res.data.employee);

      alert("Profile updated successfully!");
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.msg);
      } else {
        alert("An error occurred while updating profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="px-2 py-1.5 cursor-pointer flex items-center justify-between gap-2 hover:bg-neutral-100 rounded"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}>
        Profile <User className="w-4 h-4 text-neutral-500" />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" {...form.register("name")} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone-number">Phone number</Label>
                <Input
                  id="phone-number"
                  {...form.register("phoneNumber")}
                  type="text"
                />
              </div>
              {user?.role !== "manager" && (
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" {...form.register("email")} type="email" />
                </div>
              )}
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  type="button"
                  className="active:scale-95"
                  onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="default"
                type="submit"
                className="active:scale-95"
                disabled={loading || !isDirty}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
