import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import Avatar from "./Avatar";
import { Users, Search, X, UserPlus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { t } = useLanguageStore();
  const {
    setIsAddFriendOpen,
    pendingCount,
    getPendingRequests,
    subscribeToFriendEvents,
    unsubscribeFromFriendEvents,
  } = useFriendStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
    getPendingRequests();
    subscribeToFriendEvents();

    return () => unsubscribeFromFriendEvents();
  }, [getUsers, getPendingRequests, subscribeToFriendEvents, unsubscribeFromFriendEvents]);

  const filteredUsers = useMemo(() => {
    let list = users || [];
    if (showOnlineOnly) {
      list = list.filter((user) => (onlineUsers || []).includes(user._id));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((user) => user.fullName?.toLowerCase().includes(q));
    }
    return list;
  }, [users, showOnlineOnly, onlineUsers, searchQuery]);

  if (isUsersLoading) return <SidebarSkeleton />;

  const onlineCount = (onlineUsers?.length > 0 ? onlineUsers.length - 1 : 0);

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-base-300/80 flex flex-col transition-all duration-200 bg-base-100/70 backdrop-blur-sm select-none">
      {/* Sidebar Header */}
      <div className="border-b border-base-300/70 w-full p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm hidden lg:block tracking-tight text-base-content">
              {t("contacts")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Add Friend Button with Request Badge in Orange */}
            <button
              onClick={() => setIsAddFriendOpen(true)}
              className="relative btn btn-ghost btn-circle btn-sm text-orange-500 hover:text-orange-600 hover:bg-orange-500/15 transition-all hover:scale-110 shadow-xs"
              title="Add Friends & Requests"
            >
              <UserPlus className="w-4 h-4 text-orange-500" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-xs">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Online Count Badge */}
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-success/10 text-success border border-success/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              {onlineCount} {t("online").toLowerCase()}
            </span>
          </div>
        </div>

        {/* Search Contacts (Large screens) */}
        <div className="hidden lg:block relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered input-xs w-full pl-8 pr-7 h-8 rounded-xl text-xs bg-base-200/50 focus:bg-base-100 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              title="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Online filter toggle */}
        <div className="hidden lg:flex items-center justify-between pt-0.5">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-primary checkbox-xs rounded"
            />
            <span className="text-xs font-medium text-base-content/70">{t("showOnlineOnly")}</span>
          </label>
          <span className="text-[11px] text-base-content/40">
            {filteredUsers.length} {filteredUsers.length === 1 ? "friend" : "friends"}
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-2 px-2 space-y-1 flex-1">
        <AnimatePresence>
          {filteredUsers.map((user) => {
            const isSelected = selectedUser?._id === user._id;
            const isOnline = (onlineUsers || []).includes(user._id);

            return (
              <motion.button
                key={user._id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full p-2.5 rounded-xl flex items-center gap-3 transition-all text-left
                  ${isSelected 
                    ? "bg-primary/10 border-l-4 border-primary shadow-xs font-semibold" 
                    : "hover:bg-base-200/80 border-l-4 border-transparent text-base-content/80"}
                `}
              >
                {/* Avatar with fallback and online status */}
                <Avatar
                  src={user.profilePic}
                  name={user.fullName}
                  size="w-11 h-11"
                  textSize="text-sm"
                  className="mx-auto lg:mx-0"
                  badge={
                    isOnline ? (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-base-100 shadow-xs" />
                    ) : null
                  }
                />

                {/* User info */}
                <div className="hidden lg:block min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold truncate ${isSelected ? "text-primary" : "text-base-content"}`}>
                      {user.fullName}
                    </h4>
                  </div>
                  <p className="text-[11px] text-base-content/50 truncate flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-success" : "bg-base-content/30"}`} />
                    <span className={isOnline ? "text-success font-medium" : ""}>
                      {isOnline ? t("online") : t("offline")}
                    </span>
                  </p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 px-3 space-y-3">
            {searchQuery ? (
              <div className="text-xs text-base-content/50 space-y-1">
                <p className="font-semibold">{t("noUsersFound")}</p>
                <p className="text-[11px]">No contact matches "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto shadow-xs">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-base-content hidden lg:block">
                    No conversations yet
                  </h4>
                  <p className="text-[11px] text-base-content/60 leading-tight hidden lg:block">
                    Add friends to start messaging like Instagram!
                  </p>
                </div>
                <button
                  onClick={() => setIsAddFriendOpen(true)}
                  className="btn bg-orange-500 hover:bg-orange-600 text-white border-none btn-xs rounded-xl w-full shadow-xs gap-1 hidden lg:flex items-center justify-center font-semibold"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Find Friends</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;