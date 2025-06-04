import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/commons/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutDashboardProps {
  children: React.ReactNode;
}
const LayoutDashboard = ({ children }: LayoutDashboardProps) => {
  return (
    <>
      <div className="flex min-h-screen bg-[#fafbfc]">
        {/* Sidebar */}
        <SidebarProvider >
          <AppSidebar />
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
