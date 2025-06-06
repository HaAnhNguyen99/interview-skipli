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
