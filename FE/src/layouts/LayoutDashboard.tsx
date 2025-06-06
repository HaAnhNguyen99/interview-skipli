import AppSidebar from "@/components/commons/AppSidebar";
import Header from "@/components/commons/Header";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/commons/ui/sidebar";
import { useUser } from "@/context/UserContext";

interface LayoutDashboardProps {
  children: React.ReactNode;
}
const LayoutDashboard = ({ children }: LayoutDashboardProps) => {
  const { user } = useUser();
  const isAdmin = user?.role === "manager";

  const adminItems = [
    {
      title: "Manage Employee",
      url: "/admin/dashboard",
    },
    {
      title: "Manage Task",
      url: "/admin/tasks",
    },
    {
      title: "Message",
      url: "/messages",
    },
  ];

  const employeeItems = [
    {
      title: "Dashboard",
      url: "/employee/dashboard",
    },
    {
      title: "Message",
      url: "/messages",
    },
  ];
  return (
    <>
      <div className="flex min-h-screen bg-[#fafbfc]">
        {/* Sidebar */}
        <SidebarProvider>
          <AppSidebar items={isAdmin ? adminItems : employeeItems} />
          <main className="w-full">
            <SidebarTrigger />

            {/* Header */}
            <Header />
            {children}
          </main>
        </SidebarProvider>
      </div>
    </>
  );
};

export default LayoutDashboard;
