import { sendAccessCode } from "../services/authService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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

  // Form nhập SĐT
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
  } = useForm<PhoneForm>({ resolver: zodResolver(phoneSchema) });

  // Gửi mã
  const onSendPhone = async (data: PhoneForm) => {
    setLoading(true);
    setMsg("");
    let normalizedPhone = data.phone.trim();
    if (normalizedPhone.startsWith("0") && normalizedPhone.length >= 10) {
      normalizedPhone = "84" + normalizedPhone.slice(1);
    }
    console.log(normalizedPhone);
    try {
      await sendAccessCode(normalizedPhone);
      setPhone(normalizedPhone);
      setStep(2);
      setMsg("Code sent successfully! Please check your phone.");
    } catch (err) {
      if (err instanceof Error) {
        setMsg("Can not sent code: " + (err.message || " Network Error!"));
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border border-gray-300 rounded-md p-4 h-fit px-10 py-8">
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
          <div style={{ color: "red" }}>{phoneErrors.phone.message}</div>
        )}

        <div
          className={`mt-5 ${
            msg.includes("thành công") ? "text-green-400" : "text-red-400"
          }`}>
          {msg}
        </div>
        <p className="text-neutral-400 mt-10">
          Don't having account?
          <a href="#" className="text-blue-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPhone;
