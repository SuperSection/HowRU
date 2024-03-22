import { TiMessages } from "react-icons/ti";

export default function NoChatSelected() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>HowRU👋🏻 Super Section</p>
        <p>Select a chat and start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
}
