import { useUser } from "@/context/UserContext";
import { Link } from "react-router-dom";

export const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  if (user?.role !== "manager") {
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-screen">
        You are not authorized to access this page
        <Link to="/" className="text-blue-500">
          Go to home
        </Link>
      </div>
    );
  }
  return <>{children}</>;
};
