import { useChat } from "@/context/ChatConText";
import type { Employee } from "@/types/employee";

const ChatSidebar = ({
  employees,
}: {
  employees: Employee[] | null | undefined;
}) => {
  const { selectedEmployee, setSelectedEmployee } = useChat();
  return (
    <aside className="w-1/5 h-full border-r border-gray-200">
      {employees?.map((employee) => (
        <div
          key={employee.id}
          className={`${
            selectedEmployee?.id === employee.id ? "bg-blue-500" : ""
          }`}
          onClick={() => setSelectedEmployee(employee)}>
          {employee.name}
        </div>
      ))}
    </aside>
  );
};

export default ChatSidebar;
