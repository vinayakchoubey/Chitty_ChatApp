import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import AddFriendModal from "../components/AddFriendModal";
import { motion } from "framer-motion";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-200/80 to-base-300/50 flex items-center justify-center pt-16 sm:pt-20 pb-4 px-2 sm:px-6 select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-6xl h-[calc(100vh-5.5rem)] bg-base-100/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-base-300/80 shadow-2xl shadow-base-content/5 overflow-hidden"
      >
        <div className="flex h-full w-full overflow-hidden">
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </motion.div>

      {/* Add Friends & Requests Modal */}
      <AddFriendModal />
    </div>
  );
};
export default HomePage;