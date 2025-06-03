import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { useLocation, useNavigate } from "react-router-dom";

interface LayoutDashboardProps {
  children: React.ReactNode;
}
const LayoutDashboard = ({ children }: LayoutDashboardProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      {/* Sidebar */}

      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default LayoutDashboard;
