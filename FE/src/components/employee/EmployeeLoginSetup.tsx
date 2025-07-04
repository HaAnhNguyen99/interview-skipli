import { cn } from "@/lib/utils";
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
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setupEmployee } from "@/services/employeeApi";
import axios from "axios";

const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

const EmployeeLoginSetup = () => {
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const employeeId = searchParams.get("id");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const navigate = useNavigate();

  if (!token || !employeeId) {
    return (
      <div className="text-center text-red-500 text-6xl font-extrabold flex justify-center items-center h-screen tracking-tight ">
        Invalid setup link!
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    setSubmitted(false);
    setLoginErr(null);

    try {
      const res = await setupEmployee(
        token,
        employeeId,
        data.username,
        data.password
      );

      if (res.data.success) {
        setSubmitted(true);
        navigate("/employee/login");
      } else {
        setLoginErr(res.data.msg || "Something went wrong, please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 400) {
          setLoginErr(err.response?.data?.msg);
        } else {
          setLoginErr(
            err.response?.data?.msg || "Something went wrong, please try again!"
          );
        }
      }
    }
  };

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
              <div className="grid gap-3">
                <Label htmlFor="password-confirm">Confirm Password</Label>
                <Input
                  id="password-confirm"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("passwordConfirm")}
                  autoComplete="new-password"
                />
                {errors.passwordConfirm && (
                  <span className="text-sm text-red-500">
                    {errors.passwordConfirm.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create"}
              </Button>
              {submitted && (
                <div className="text-green-500 text-center mt-2">
                  Setup successful!
                </div>
              )}
            </form>
          </CardContent>
          {loginErr && (
            <div className="text-red-500 text-center mt-2">{loginErr}</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmployeeLoginSetup;
