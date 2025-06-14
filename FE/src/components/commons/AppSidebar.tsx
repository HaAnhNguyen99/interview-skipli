import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/commons/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.webp";
import type { LucideIcon } from "lucide-react";

const AppSidebar = ({
  items,
}: {
  items: { title: string; url: string; icon: LucideIcon }[];
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Sidebar>
      <SidebarHeader className="mx-auto mb-6">
        <img src={logo} alt="logo" className="w-20 h-20" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const isActive = location.pathname.startsWith(item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      isActive
                        ? "bg-blue-100 border-r-4 border-blue-500"
                        : "bg-transparent border-r-4 border-transparent hover:bg-blue-50"
                    } cursor-pointer`}
                    onClick={() => navigate(item.url)}>
                    <div key={item.title}>
                      <item.icon className="w-5 h-5 mr-2" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
