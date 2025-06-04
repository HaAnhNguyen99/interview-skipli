import { useUser } from "@/context/UserContext";
import { verifyAccessCode } from "@/services/authService";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Backbtn from "./commons/Backbtn";
const OTP_LENGTH = 6;
const OTPVerify = ({
  setStep,
  phone,
}: {
  phone: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [values, setValues] = useState(Array(OTP_LENGTH).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length === 0) {
      setValues((prev) => {
        const next = [...prev];
        next[i] = "";
        return next;
      });
      return;
    }
    setValues((prev) => {
      const next = [...prev];
      next[i] = val[0];
      return next;
    });
    // Move focus to next input
    if (i < OTP_LENGTH - 1 && val) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      setValues((prev) => {
        const next = [...prev];
        next[i - 1] = "";
        return next;
      });
      inputs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const otp = values.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    try {
      const res = await verifyAccessCode(phone, otp);
      if (res.data.success) {
        login({
          token: res.data.token,
          phoneNumber: res.data.phoneNumber,
          role: res.data.role,
        });
        setError("Đăng nhập thành công!");
        navigate("/admin/dashboard");
      } else {
        setError("Sai mã truy cập!");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Wrong code or expired code. " + (err.message || ""));
      }
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
          <div className="flex justify-center">
            <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
              <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">
                  Mobile Phone Verification
                </h1>
                <p className="text-[15px] text-slate-500">
                  Enter the 6-digit verification code that was sent to your
                  phone number.
                </p>
              </header>
              <form id="otp-form" onSubmit={handleSubmit} autoComplete="off">
                <div className="flex items-center justify-center gap-3">
                  {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="\d*"
                      maxLength={1}
                      className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="0"
                      value={values[i]}
                      ref={(el) => {
                        inputs.current[i] = el;
                      }}
                      onChange={(e) => handleChange(i, e)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                    />
                  ))}
                </div>

                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}

                <div className="max-w-[260px] mx-auto mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150">
                    {loading ? "Verifying..." : "Verify Account"}
                  </button>
                </div>
              </form>
              <div className="text-sm text-slate-500 mt-4 flex justify-between">
                <div className="">
                  <Backbtn
                    action={() => setStep(1)}
                    className="text-slate-500"
                  />
                </div>
                <div>
                  Didn't receive code?{" "}
                  <a
                    className="font-medium text-indigo-500 hover:text-indigo-600"
                    href="#0">
                    Resend
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
