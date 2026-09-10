import { X, Phone, Video, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useLanguageStore } from "../store/useLanguageStore";
import Avatar from "./Avatar";
import { toast } from "sonner";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { t } = useLanguageStore();

  const isOnline = (onlineUsers || []).includes(selectedUser?._id);

  const handleCall = (type) => {
    toast.info(`${type === "video" ? "Video call" : "Voice call"} with ${selectedUser?.fullName || "user"} will be available in next update!`);
  };

  return (
    <div className="px-4 sm:px-6 py-3 border-b border-base-300/80 bg-base-100/80 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with fallback and online indicator */}
          <Avatar
            src={selectedUser?.profilePic}
            name={selectedUser?.fullName}
            size="w-10 h-10"
            textSize="text-sm"
            badge={
              isOnline ? (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-base-100 shadow-xs" />
              ) : null
            }
          />

          {/* User info */}
          <div>
            <h3 className="font-bold text-sm text-base-content leading-tight">
              {selectedUser?.fullName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-success animate-pulse" : "bg-base-content/30"}`} />
              <span className={`text-[11px] ${isOnline ? "text-success font-medium" : "text-base-content/60"}`}>
                {isOnline ? t("online") : t("offline")}
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button 
            type="button" 
            onClick={() => handleCall("voice")}
            className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-primary hover:bg-base-200"
            title="Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            onClick={() => handleCall("video")}
            className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-primary hover:bg-base-200"
            title="Video Call"
          >
            <Video className="w-4 h-4" />
          </button>

          <div className="divider divider-horizontal my-2 mx-1" />

          {/* Close button */}
          <button 
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-error hover:bg-error/10 transition-colors"
            title="Close conversation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;