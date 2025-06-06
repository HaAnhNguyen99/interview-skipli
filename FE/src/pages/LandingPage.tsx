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
    <div>
      <Button variant="outline" onClick={() => navigate("/signin")}>
        Login
      </Button>
      <Button variant="default" onClick={() => navigate("/employee/login")}>
        Signup
      </Button>
    </div>
  );
};

export default LandingPage;
