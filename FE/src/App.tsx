import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import { UserProvider } from "./context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import EmployeeLoginSetup from "./components/EmployeeLoginSetup";
import EmployeeLogin from "./components/EmployeeLogin";
import EmployeeDashboard from "./components/EmployeeDashboard";
import LayoutDashboard from "./layouts/LayoutDashboard";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <LayoutDashboard>
                    <Dashboard />
                  </LayoutDashboard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tasks"
              element={
                <ProtectedRoute>
                  <LayoutDashboard>Tasks</LayoutDashboard>
                </ProtectedRoute>
              }
            />

            <Route path="/signin" element={<SignIn />} />
            <Route path="/employee/setup" element={<EmployeeLoginSetup />} />
            <Route path="/employee/login" element={<EmployeeLogin />} />
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
