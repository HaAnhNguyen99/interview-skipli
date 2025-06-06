interface SignInProps {
  title: string;
  desc: string;
  btnTitle: string;
  label: string;
  actionLabel: string;
}

const Login = ({ title, desc, btnTitle, label, actionLabel }: SignInProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border border-gray-300 rounded-md p-4 h-fit px-10 py-8">
        <div className="mt-5">{/* <Backbtn /> */}</div>
        <form className="space-y-7 text-center">
          <h1 className="text-3xl mt-3 font-bold text-center">{title}</h1>
          <p className="text-neutral-400">{desc}</p>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10,15}"
            placeholder="Your Phone number"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400 px-4"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full">
            {btnTitle}
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

export default Login;
