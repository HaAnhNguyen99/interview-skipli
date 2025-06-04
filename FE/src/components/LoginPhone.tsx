import { sendAccessCode } from "../services/authService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";

// Zod schema cho số điện thoại
const phoneSchema = z.object({
  phone: z
    .string()
    .length(10, "Số điện thoại phải đúng 10 số")
    .regex(/^0\d{9}$/, "Số điện thoại phải bắt đầu bằng 0 và có 10 số"),
});

type PhoneForm = z.infer<typeof phoneSchema>;

const LoginPhone = ({
  setStep,
  setPhone,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSendOTP, setIsSendOTP] = useState<boolean>(false);

  // Form nhập SĐT
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
  } = useForm<PhoneForm>({ resolver: zodResolver(phoneSchema) });

  const onSendPhone = async (data: PhoneForm) => {
    setLoading(true);
    setMsg("");
    let normalizedPhone = data.phone.trim();
    if (normalizedPhone.startsWith("0") && normalizedPhone.length >= 10) {
      normalizedPhone = "84" + normalizedPhone.slice(1);
    }
    try {
      await sendAccessCode(normalizedPhone);
      setPhone(normalizedPhone);
      setStep(2);
      setMsg("Code sent successfully! Please check your phone.");
      localStorage.setItem("send_OTP", "true");
      localStorage.setItem("phone", normalizedPhone);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMsg(
          err.response?.data?.msg || "Something went wrong, please try again!"
        );

        if (err.status === 400) {
          setIsSendOTP(true);
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border w-full max-w-md border-gray-300 rounded-md p-4 h-fit px-10 py-8">
        <form
          onSubmit={handleSubmitPhone(onSendPhone)}
          className="space-y-7 text-center">
          <h1 className="text-3xl mt-3 font-bold text-center">Sign In</h1>
          <p className="text-neutral-400">Please enter your phone to sign in</p>
          <input
            type="text"
            placeholder="Your Phone number"
            {...registerPhone("phone")}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400 px-4"
            disabled={loading}
          />

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full"
            type="submit"
            disabled={loading}>
            {loading ? "Sending..." : "Next"}
          </button>
        </form>

        {phoneErrors.phone && (
          <div className="text-red-500 text-center">
            {phoneErrors.phone.message}
          </div>
        )}

        <div
          className={`mt-5 ${
            msg.includes("thành công") ? "text-green-400" : "text-red-400"
          }`}>
          {msg}
        </div>
        <p className="text-neutral-400 mt-10 flex justify-between">
          <div>
            Don't having account?{" "}
            <a href="#" className="text-blue-500">
              Sign Up
            </a>
          </div>
          {isSendOTP && (
            <div
              className="text-blue-500 underline cursor-pointer active:scale-[0.98] transition-all duration-150"
              onClick={() => setStep(2)}>
              Verify code
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPhone;
