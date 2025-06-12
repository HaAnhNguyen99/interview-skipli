import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import { UserProvider } from "./context/UserContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import EmployeeLoginSetup from "./components/employee/EmployeeLoginSetup";
import EmployeeLogin from "./components/employee/EmployeeLogin";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import LayoutDashboard from "./layouts/LayoutDashboard";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { ManagerRoute } from "./routes/ManagerRoute";
import ManageTask from "./pages/ManageTask";
import { TaskProvider } from "./context/TaskContext";
import Messages from "./pages/Messages";
import LayoutChat from "./layouts/LayoutChat";
import { ChatProvider } from "./context/ChatConText";
import UploadImage from "./components/commons/UploadImage";
const ROUTES = {
  HOME: "/",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    TASKS: "/admin/tasks",
  },
  SIGNIN: "/signin",
  MESSAGES: "/messages",
  EMPLOYEE: {
    SETUP: "/employee/setup",
    LOGIN: "/employee/login",
    DASHBOARD: "/employee/dashboard",
  },
};

const routeConfig = [
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },
  {
    path: ROUTES.ADMIN.DASHBOARD,
    element: (
      <ProtectedRoute>
        <ManagerRoute>
          <LayoutDashboard>
            <Dashboard />
          </LayoutDashboard>
        </ManagerRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN.TASKS,
    element: (
      <ProtectedRoute>
        <ManagerRoute>
          <LayoutDashboard>
            <TaskProvider>
              <ManageTask />
            </TaskProvider>
          </LayoutDashboard>
        </ManagerRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SIGNIN,
    element: <SignIn />,
  },
  {
    path: ROUTES.EMPLOYEE.SETUP,
    element: <EmployeeLoginSetup />,
  },
  {
    path: ROUTES.EMPLOYEE.LOGIN,
    element: <EmployeeLogin />,
  },
  {
    path: ROUTES.EMPLOYEE.DASHBOARD,
    element: (
      <ProtectedRoute>
        <LayoutDashboard>
          <EmployeeDashboard />
        </LayoutDashboard>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MESSAGES,
    element: (
      <ProtectedRoute>
        <LayoutDashboard>
          <ChatProvider>
            <LayoutChat>
              <Messages />
            </LayoutChat>
          </ChatProvider>
        </LayoutDashboard>
      </ProtectedRoute>
    ),
  },
];

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {routeConfig.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
