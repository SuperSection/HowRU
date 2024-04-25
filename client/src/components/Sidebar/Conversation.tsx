export default function Conversation() {
  return (
    <>
      <div className="flex gap-4 items-center hover:bg-violet-500 rounded p-2 py-1 my-1 cursor-pointer transition">
        <div className="avatar online">
          <div className="w-12 h-12 rounded-full border-2 border-white">
            <img src="/images/avatar.png" alt="user-avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div>
            <p className="text-base font-medium text-gray-100">Super Section</p>
          </div>
        </div>
      </div>

      <div className="divider my-0 py-0 h-1" />
    </>
  );
}
