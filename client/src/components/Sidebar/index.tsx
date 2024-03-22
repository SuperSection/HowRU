import ConversationsList from "./ConversationsList";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  return (
    <div className="border-r border-slate-500 hidden md:flex flex-col p-3 transition">
      <SearchInput />
      <div className="divider px-3" />
      <ConversationsList />

      <LogoutButton />
    </div>
  );
};

export default Sidebar;
