import type { Employee } from "@/types/employee";
import React, { createContext, useContext, useState } from "react";

type ChatContextType = {
  employees: Employee[] | null | undefined;
  setEmployees: (employees: Employee[]) => void;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[] | null>();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  return (
    <ChatContext.Provider
      value={{
        employees,
        setEmployees,
        selectedEmployee,
        setSelectedEmployee,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
