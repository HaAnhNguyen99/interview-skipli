import { MoveLeft } from "lucide-react";

const Backbtn = ({ action }: { action: () => void }) => {
  return (
    <button
      className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
      onClick={action}>
      <MoveLeft />
      <p>Back</p>
    </button>
  );
};

export default Backbtn;
