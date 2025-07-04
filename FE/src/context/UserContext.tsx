import React, { createContext, useContext, useState } from "react";

type User = {
  phoneNumber: string;
  role: string;
  email?: string;
  employeeId?: string;
  name?: string;
  avatarUrl?: string;
};

type UserContextType = {
  user: User | null;
  token: string;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  updateUserData: (fields: UpdateUserFields) => void;
};

type UpdateUserFields = Pick<User, "name" | "email" | "phoneNumber">;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      return { token, ...JSON.parse(user) };
    }
    return null;
  });
  const [token, setToken] = useState<string>(() => {
    const token = localStorage.getItem("token");
    return token || "";
  });

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const updateUserData = (fields: UpdateUserFields) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const updatedUser = { ...prevUser, ...fields };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    setToken("null");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUser = (fields: UpdateUserFields) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const updatedUser = { ...prevUser, ...fields };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <UserContext.Provider
      value={{ user, token, login, logout, updateUser, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
