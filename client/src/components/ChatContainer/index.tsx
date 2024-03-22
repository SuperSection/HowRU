import MessageInput from "./MessageInput";
import MessagesSection from "./MessagesSection";
import NoChatSelected from "./NoChatSelected";


const ChatContainer = () => {
  const noChatSelected = false;
  return (
    <div className="w-[90vw] md:w-[60vw] flex flex-col overflow-hidden">
      {noChatSelected ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="px-6 py-2 mb-2 flex items-center gap-2 bg-purple-800 ">
            <span className="label-text">To:</span>
            <p className="text-white font-semibold text-xl">Super Section</p>
          </div>

          <MessagesSection />
          <MessageInput />
        </>
      )}
    </div>
  );
};


export default ChatContainer;