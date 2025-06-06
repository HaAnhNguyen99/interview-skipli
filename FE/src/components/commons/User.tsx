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
import { KeyRound, Lock, LogOutIcon } from "lucide-react";

const User = () => {
  const { logout } = useUser();
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-fit rounded-full bg-white border">
            <img src={avt} alt="avatar" className="w-10 h-10 rounded-full" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <Profile />
            <div
              className="px-2 py-1.5 cursor-pointer flex items-center justify-between gap-2 hover:bg-neutral-100 rounded"
              onClick={(e) => {
                e.stopPropagation(); // Không đóng menu
              }}>
              Change Password <Lock className="w-[14px] h-3 text-neutral-500" />
            </div>
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
