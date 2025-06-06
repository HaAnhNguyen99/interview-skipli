import { useEffect, useState } from "react";
import LoginPhone from "../components/commons/LoginPhone";
import OTPVerify from "@/components/commons/OTPVerify";

const SignIn = () => {
  const [step, setStep] = useState<number>(1);
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    const sendOTP = localStorage.getItem("send_OTP");
    const phone = localStorage.getItem("phone");
    if (sendOTP && phone) {
      setStep(2);
      setPhone(phone);
    }
  }, []);
  return (
    <>
      {step === 1 && <LoginPhone setStep={setStep} setPhone={setPhone} />}
      {step === 2 && <OTPVerify phone={phone} setStep={setStep} />}
    </>
  );
};

export default SignIn;
