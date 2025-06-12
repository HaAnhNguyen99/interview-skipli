import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/commons/ui/dropdown-menu";
import avt from "@/assets/avt.png";
import Profile from "./Profile";
import { useUser } from "@/context/UserContext";
import { LogOutIcon } from "lucide-react";

const User = () => {
  const { logout, user } = useUser();
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-fit rounded-full bg-white border cursor-pointer p-1 hover:bg-gray-100 transition-all">
            <img
              src={user?.role === "manager" ? avt : user?.avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <Profile />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => logout()}>
            Log out
            <DropdownMenuShortcut>
              <LogOutIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default User;
