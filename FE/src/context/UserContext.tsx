import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  phoneNumber: string;
  role: string;
  token: string;
};

type UserContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const role = localStorage.getItem("role");
    if (token && phoneNumber && role) {
      return { token, phoneNumber, role };
    }
    return null;
  });

  // Khi login, lưu vào context + localStorage
  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("token", user.token);
    localStorage.setItem("phoneNumber", user.phoneNumber);
    localStorage.setItem("role", user.role);
  };

  // Khi logout, xoá context + localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("role");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để dùng context
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
