export default function Message() {
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src="/images/avatar.png" alt="person-dp" />
        </div>
      </div>
      <div className={`chat-bubble text-white bg-blue-700`}>
        Hi, What is up?
      </div>
      <div className={`chat-footer opacity-50 text-xs flex gap-1 items-center`}>
        22:48
      </div>
    </div>
  );
}
