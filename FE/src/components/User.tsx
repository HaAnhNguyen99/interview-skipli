import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import avt from "@/assets/avt.png";
import Profile from "./Profile";

const User = () => {
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

          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default User;
