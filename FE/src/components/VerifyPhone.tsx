import { useNavigate } from "react-router-dom";
import { verifyAccessCode } from "../services/authService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Backbtn from "./commons/Backbtn";
import { useUser } from "@/context/UserContext";

// Zod schema cho OTP
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Mã OTP phải có 6 số")
    .regex(/^\d+$/, "Chỉ nhập số"),
});

type OtpForm = z.infer<typeof otpSchema>;

const VerifyPhone = ({
  setStep,
  phone,
}: {
  phone: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const title = "Phone verification";
  const desc = "Please enter your code that send to your phone";
  const btnTitle = "Submit";
  const label = "Code not receive?";
  const actionLabel = "Send again";

  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { login } = useUser();

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpForm>({ resolver: zodResolver(otpSchema) });

  const onSubmitOtp = async (data: OtpForm) => {
    setLoading(true);
    setMsg("");
    try {
      const res = await verifyAccessCode(phone, data.otp);
      if (res.data.success) {
        login({
          token: res.data.token,
          phoneNumber: res.data.phoneNumber,
          role: res.data.role,
        });
        setMsg("Đăng nhập thành công!");
        navigate("/dashboard");
      } else {
        setMsg("Sai mã truy cập!");
      }
    } catch (err) {
      if (err instanceof Error) {
        setMsg("Wrong code or expired code. " + (err.message || ""));
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border border-gray-300 rounded-md p-4 h-fit px-10 py-8">
        <div className="mt-5">
          <Backbtn action={() => setStep(1)} />
        </div>
        <form
          onSubmit={handleSubmitOtp(onSubmitOtp)}
          className="space-y-7 text-center">
          <h1 className="text-3xl mt-3 font-bold text-center">{title}</h1>
          <p className="text-neutral-400">{desc}</p>
          <input
            type="text"
            {...registerOtp("otp")}
            placeholder="Enter your OTP"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400 px-4"
          />
          {otpErrors.otp && (
            <div style={{ color: "red" }}>{otpErrors.otp.message}</div>
          )}

          <div
            className={`mt-5 ${
              msg.includes("thành công") ? "text-green-400" : "text-red-400"
            }`}>
            {msg}
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full"
            type="submit"
            disabled={loading}>
            {loading ? "Sending..." : btnTitle}
          </button>
        </form>
        <p className="text-neutral-400 mt-10">
          {label}{" "}
          <a href="#" className="text-blue-500">
            {actionLabel}
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyPhone;
