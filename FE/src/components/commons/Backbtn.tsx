import { MoveLeft } from "lucide-react";

const Backbtn = ({
  action,
  className,
}: {
  action: () => void;
  className?: string;
}) => {
  return (
    <button
      className={`transition-all duration-400 flex items-center gap-2 border-1 border-transparent hover:text-gray-700 transition-colors hover:cursor-pointer hover:border-b hover:border-b-gray-700 box-content ${
        className ? className : ""
      }`}
      onClick={action}>
      <MoveLeft className={`${className ? className : ""}`} />
      <p>Back</p>
    </button>
  );
};

export default Backbtn;
