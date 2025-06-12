import { Button } from "@/components/commons/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/commons/ui/card";
import { Input } from "@/components/commons/ui/input";
import { Label } from "@/components/commons/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginEmployee } from "@/services/employeeApi";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import Loading from "../commons/loading/loading";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const EmployeeLogin = () => {
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const { login } = useUser();

  const onSubmit = async (data: FormValues) => {
    setLoginErr(null);

    try {
      const res = await loginEmployee(data.username, data.password);

      const {
        employeeId,
        success,
        token,
        phoneNumber,
        role,
        email,
        name,
        avatarUrl,
      } = res.data;

      if (success) {
        login({ employeeId, phoneNumber, role, email, name, avatarUrl }, token);
        navigate("/employee/dashboard");
      } else {
        setLoginErr(res.data.msg || "Invalid username or password");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setLoginErr(
          err.response?.data?.msg || "Something went wrong, please try again!"
        );
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-6 w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Employee Account Setup
            </CardTitle>
            <CardDescription className="text-center text-sm text-gray-500 max-w-4/5 mx-auto">
              Please create a username and password to access your employee
              account. This will be used for logging in to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username")}
                  autoComplete="username"
                />
                {errors.username && (
                  <span className="text-sm text-red-500">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Login"}
              </Button>

              {loginErr && (
                <span className="text-sm text-red-500">{loginErr}</span>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeLogin;
