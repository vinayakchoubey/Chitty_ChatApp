import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import Avatar from "./Avatar";
import AiChatBackground from "./AiChatBackground";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { motion } from "framer-motion";
import { CheckCheck, Sparkles, MessageCircle } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const handleQuickGreeting = async (text) => {
    await sendMessage({ text, image: null });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100/40 relative">
      <ChatHeader />

      {/* Main Conversation Area with Animated AI Background */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* Animated AI Wallpaper & Particle Canvas */}
        <AiChatBackground />

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative z-10">
        {/* Date / Conversation start banner */}
        <div className="flex items-center justify-center my-2">
          <span className="text-[10px] font-semibold text-base-content/50 bg-base-200/80 border border-base-300/80 px-3 py-1 rounded-full shadow-2xs">
            Conversation with {selectedUser?.fullName}
          </span>
        </div>

        {/* Empty Conversation State with Icebreakers */}
        {(!messages || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-base-content">
                No messages yet with {selectedUser?.fullName}
              </h4>
              <p className="text-xs text-base-content/60 max-w-xs">
                Send a quick hello or start the conversation below!
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {["👋 Hey there!", "Hello! How are you?", "Let's connect!"].map((text) => (
                <button
                  key={text}
                  onClick={() => handleQuickGreeting(text)}
                  className="btn btn-xs btn-outline rounded-full hover:btn-primary text-xs transition-colors"
                >
                  <Sparkles className="w-3 h-3 mr-1 text-primary" />
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        {(messages || []).map((message) => {
          const isMe = message.senderId === authUser._id;
          const senderName = isMe ? authUser?.fullName : selectedUser?.fullName;
          const avatarSrc = isMe ? authUser?.profilePic : selectedUser?.profilePic;

          return (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              {/* Message Avatar with safe fallback */}
              <div className="chat-image avatar">
                <Avatar
                  src={avatarSrc}
                  name={senderName}
                  size="w-8 h-8"
                  textSize="text-xs"
                  ring={false}
                  className="shadow-xs"
                />
              </div>

              {/* Message Bubble */}
              <div
                className={`
                  chat-bubble flex flex-col p-3 shadow-sm text-sm break-words max-w-[85%] sm:max-w-md
                  ${isMe 
                    ? "bg-primary text-primary-content font-medium rounded-2xl rounded-tr-xs shadow-md shadow-primary/20" 
                    : "bg-base-200 text-base-content rounded-2xl rounded-tl-xs border border-base-300"}
                `}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[280px] rounded-xl mb-2 object-cover border border-base-content/10 shadow-xs"
                  />
                )}
                {message.text && <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>}

                {/* Timestamp & Status */}
                <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
                  isMe ? "text-primary-content/75" : "text-base-content/50"
                }`}>
                  <span>{formatMessageTime(message.createdAt)}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;