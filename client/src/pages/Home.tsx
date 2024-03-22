import Sidebar from "../components/Sidebar";
import MessageContainer from "../components/ChatContainer";

const Home = () => {
  return (
    <div className="flex h-[85vh] rounded-lg px-3 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};


export default Home;