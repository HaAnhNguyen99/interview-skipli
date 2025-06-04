import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button variant="outline" onClick={() => navigate("/signin")}>
        Login
      </Button>
      <Button variant="default" onClick={() => navigate("/signup")}>
        Signup
      </Button>
    </div>
  );
};

export default LandingPage;
