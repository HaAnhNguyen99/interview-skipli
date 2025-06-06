import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
