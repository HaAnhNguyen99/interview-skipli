import ChatSidebar from "@/components/commons/ChatSidebar";
import { useChat } from "@/context/ChatConText";
import { useUser } from "@/context/UserContext";
import { getAllEmployees } from "@/services/employeeApi";
import { useEffect } from "react";

const LayoutChat = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useUser();
  const { employees, setEmployees } = useChat();

  useEffect(() => {
    if (!token) return;

    if (user?.role !== "manager") {
      setEmployees([]);
    } else {
      getAllEmployees(token)
        .then((res) => setEmployees(res.data?.employees ?? []))
        .catch((err) => {
          console.log(err);
          setEmployees([]);
        });
    }
  }, [token, setEmployees]);

  return (
    <div className="flex h-full">
      {employees && user?.role === "manager" && (
        <ChatSidebar employees={employees} />
      )}
      <main className="px-10">{children}</main>
    </div>
  );
};

export default LayoutChat;
