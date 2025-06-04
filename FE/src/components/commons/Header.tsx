import { Bell } from "lucide-react";
import User from "@/components/User";
const Header = () => {
  return (
    <header className="flex items-center justify-end gap-5 w-full h-16 bg-white border-b border-gray-200 px-10">
      <div className="w-fit p-2 rounded-full bg-white border border-gray-200">
        <Bell className="w-5 h-5" />
      </div>

      <User />
    </header>
  );
};

export default Header;
