import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@/context/UserContext";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  return (
    <>
      {/* Custom item thay vì DropdownMenuItem */}
      <div
        className="px-2 py-1.5 cursor-pointer flex items-center justify-between gap-2 hover:bg-neutral-100 rounded"
        onClick={(e) => {
          e.stopPropagation(); // Không đóng menu
          setOpen(true);
        }}>
        Profile <User className="w-4 h-4 text-neutral-700" />
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
          <form>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone-number">Phone number</Label>
                <Input
                  id="phone-number"
                  name="phone-number"
                  defaultValue={user?.phoneNumber}
                  type="text"
                />
              </div>
              {user?.role === "employee" && (
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    defaultValue={user?.email}
                    type="email"
                  />
                </div>
              )}
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  type="button"
                  className="active:scale-95">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="default"
                type="submit"
                className="active:scale-95">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
