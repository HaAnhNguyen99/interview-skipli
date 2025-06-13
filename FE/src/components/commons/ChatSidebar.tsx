import { useChat } from "@/context/ChatConText";
import type { Employee } from "@/types/employee";

const ChatSidebar = ({
  employees,
}: {
  employees: Employee[] | null | undefined;
}) => {
  const { selectedEmployee, setSelectedEmployee } = useChat();
  return (
    <aside className="w-1/5 h-full border-r border-gray-200 overflow-y-scroll hide-scrollbar">
      {employees?.map((employee) => (
        <div
          key={employee.id}
          className={`px-2 py-3 border cursor-pointer flex items-center justify-between gap-2 hover:bg-amber-200 ${
            selectedEmployee?.id === employee.id ? "bg-amber-100" : ""
          }`}
          onClick={() => setSelectedEmployee(employee)}>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {employee.avatarUrl && (
              <img
                src={employee.avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col flex-1">
            <p className="text-sm font-medium">{employee.name}</p>
            <p className="text-xs text-gray-500">{employee.role}</p>
          </div>
        </div>
      ))}
    </aside>
  );
};

export default ChatSidebar;
