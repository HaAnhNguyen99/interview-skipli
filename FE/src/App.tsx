import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import SignIn from "./pages/SignIn";
import { UserProvider } from "./context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import EmployeeLoginSetup from "./components/EmployeeLoginSetup";
import EmployeeLogin from "./components/EmployeeLogin";
import OTPVerify from "./components/OTPVerify";

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <LayoutDashboard>Dashboard</LayoutDashboard>
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/employee-setup" element={<EmployeeLoginSetup />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/otp-verify" element={<OTPVerify />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>

      {/* <SignIn
        title="Sign In"
        desc="Please enter your phone to sign in"
        btnTitle="Next"
        label="Don't having account?"
        actionLabel="Sign Up"
      />
      <SignIn
        title="Sign In"
        desc="Please enter your email to sign in"
        btnTitle="Next"
        label="Don't having account?"
        actionLabel="Sign Up"
      />
      <SignIn
        title="Email verification"
        desc="Please enter your code that send to your email address"
        btnTitle="Submit"
        label="Code not receive?"
        actionLabel="Send again"
      /> */}
    </>
  );
}

export default App;
