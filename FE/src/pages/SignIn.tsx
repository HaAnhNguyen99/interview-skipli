import { useState } from "react";
import LoginPhone from "../components/LoginPhone";
import VerifyPhone from "../components/VerifyPhone";

const SignIn = () => {
  const [step, setStep] = useState<number>(1);
  const [phone, setPhone] = useState<string>("");

  return (
    <>
      {step === 1 && <LoginPhone setStep={setStep} setPhone={setPhone} />}
      {step === 2 && <VerifyPhone phone={phone} setStep={setStep} />}
    </>
  );
};

export default SignIn;
