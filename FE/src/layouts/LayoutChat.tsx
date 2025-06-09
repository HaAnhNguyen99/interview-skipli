import ChatSidebar from "@/components/commons/ChatSidebar";
import Loading from "@/components/commons/loading/loading";
import { useChat } from "@/context/ChatConText";
import { useUser } from "@/context/UserContext";
import { getAllEmployees } from "@/services/employeeApi";
import { useEffect, useState } from "react";

const LayoutChat = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useUser();
  const { employees, setEmployees } = useChat();

  useEffect(() => {
    if (!token) return;

    if (user?.role !== "manager") {
      setEmployees([]);
    } else {
      setIsLoading(true);
      getAllEmployees(token)
        .then((res) => setEmployees(res.data?.employees ?? []))
        .catch((err) => {
          console.log(err);
          setEmployees([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [token, setEmployees, user?.role]);

  return (
    <div className="flex h-[calc(100vh-100px)] relative">
      {employees && user?.role === "manager" && (
        <ChatSidebar employees={employees} />
      )}
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <main className="px-10 overflow-y-hidden h-[calc(100vh-100px)] w-full">
          {children}
        </main>
      )}
    </div>
  );
};

export default LayoutChat;
