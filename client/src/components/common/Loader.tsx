import { BiLoader } from "react-icons/bi";

export default function Loader() {
  return (
    <div className="flex items-center justify-center gap-2">
      <BiLoader className="w-5 h-5 animate-spin" />
      <span className="text-base">Loading...</span>
    </div>
  );
}
