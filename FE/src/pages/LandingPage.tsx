import { Button } from "@/components/commons/ui/button";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      if (user.role === "manager") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex justify-center items-center w-full h-screen border-r-2 border-gray-400">
        <div>
          <h2 className="text-2xl font-bold text-center text-white">
            For Admin
          </h2>
          <Button
            className="mt-5 w-full px-2 py-1"
            variant="outline"
            onClick={() => navigate("/signin")}>
            Login
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <div>
          <h2 className="text-2xl font-bold text-center text-white">
            For Employee
          </h2>
          <Button
            className="mt-5 w-full px-2 py-1"
            variant="default"
            onClick={() => navigate("/employee/login")}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
