import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.webp";

const items = [
  {
    title: "Manage Employee",
    url: "/employees",
  },
  {
    title: "Manage Task",
    url: "/tasks",
  },
  {
    title: "Message",
    url: "/messages",
  },
];

const AppSidebar = () => {
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
                    <span>{item.title}</span>
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
