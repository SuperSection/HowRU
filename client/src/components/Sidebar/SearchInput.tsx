import { IoSearchSharp } from "react-icons/io5";

export default function SearchInput() {
  return (
    <form className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered rounded-full w-[280px]"
      />
      <button type="button" className="btn btn-circle bg-sky-500 text-white">
        <IoSearchSharp className="h-5 w-5 outline-none" />
      </button>
    </form>
  );
}
