import { useState, useMemo } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useChatStore } from "../store/useChatStore";
import Avatar from "./Avatar";
import {
  X,
  UserPlus,
  UserCheck,
  Clock,
  Search,
  Check,
  MessageSquare,
  Sparkles,
  Inbox,
  UserX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddFriendModal = () => {
  const {
    isAddFriendOpen,
    setIsAddFriendOpen,
    discoverUsers,
    pendingRequests,
    pendingCount,
    isLoadingDiscover,
    isLoadingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
  } = useFriendStore();

  const { setSelectedUser } = useChatStore();

  const [activeTab, setActiveTab] = useState("discover"); // "discover" | "requests"
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDiscover = useMemo(() => {
    let list = discoverUsers || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [discoverUsers, searchQuery]);

  if (!isAddFriendOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-base-100 rounded-3xl border border-base-300 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-base-300/80 flex items-center justify-between bg-base-200/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-xs">
                <UserPlus className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-base text-base-content leading-tight">
                  Add Friends & Requests
                </h3>
                <p className="text-xs text-base-content/60">
                  Connect with users to unlock direct messaging
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddFriendOpen(false)}
              className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-base-300/80 bg-base-100 px-4 pt-2">
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === "discover"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/60 hover:text-base-content"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Discover Users</span>
              <span className="badge badge-sm badge-ghost text-[10px]">
                {discoverUsers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === "requests"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/60 hover:text-base-content"
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Friend Requests</span>
              {pendingCount > 0 && (
                <span className="badge badge-sm badge-error text-white font-bold text-[10px] animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Tab 1: Discover Users */}
          {activeTab === "discover" && (
            <div className="p-4 flex-1 flex flex-col overflow-hidden space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered input-sm w-full pl-9 rounded-xl bg-base-200/50 focus:bg-base-100 text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/40 hover:text-base-content"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {isLoadingDiscover ? (
                  <div className="py-12 text-center">
                    <span className="loading loading-spinner loading-md text-primary" />
                    <p className="text-xs text-base-content/50 mt-2">Finding users...</p>
                  </div>
                ) : filteredDiscover.length === 0 ? (
                  <div className="py-12 text-center text-base-content/50 space-y-2">
                    <UserX className="w-8 h-8 mx-auto opacity-40" />
                    <p className="text-xs font-semibold">No users found</p>
                    {searchQuery && (
                      <p className="text-[11px]">No matches for "{searchQuery}"</p>
                    )}
                  </div>
                ) : (
                  filteredDiscover.map((user) => (
                    <div
                      key={user._id}
                      className="p-3 rounded-2xl bg-base-200/40 hover:bg-base-200/80 border border-base-300/60 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          src={user.profilePic}
                          name={user.fullName}
                          size="w-10 h-10"
                          textSize="text-sm"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-base-content truncate">
                            {user.fullName}
                          </h4>
                          <p className="text-[11px] text-base-content/50 truncate">
                            {user.email || "User"}
                          </p>
                        </div>
                      </div>

                      {/* Action Button based on relationship status */}
                      <div className="shrink-0">
                        {user.friendStatus === "friends" ? (
                          <div className="flex items-center gap-1.5">
                            <span className="badge badge-success badge-sm gap-1 py-2 text-white font-medium text-[11px]">
                              <UserCheck className="w-3 h-3" /> Friends
                            </span>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setIsAddFriendOpen(false);
                              }}
                              className="btn btn-primary btn-xs rounded-xl shadow-xs"
                              title="Start chatting"
                            >
                              <MessageSquare className="w-3 h-3 mr-1" /> Chat
                            </button>
                          </div>
                        ) : user.friendStatus === "sent" ? (
                          <div className="flex items-center gap-1">
                            <span className="badge badge-warning badge-sm gap-1 py-2 font-medium text-[11px]">
                              <Clock className="w-3 h-3" /> Requested
                            </span>
                            <button
                              onClick={() => cancelFriendRequest(user._id)}
                              className="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-lg"
                              title="Cancel Request"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : user.friendStatus === "received" ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => acceptFriendRequest(user.friendshipId, user)}
                              className="btn btn-success btn-xs rounded-xl text-white font-medium gap-1 shadow-xs"
                            >
                              <Check className="w-3 h-3" /> Accept
                            </button>
                            <button
                              onClick={() => rejectFriendRequest(user.friendshipId)}
                              className="btn btn-ghost btn-xs rounded-xl text-base-content/60"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => sendFriendRequest(user._id)}
                            className="btn btn-primary btn-sm rounded-xl font-semibold gap-1.5 shadow-sm shadow-primary/20 text-xs"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Add Friend</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Incoming Friend Requests */}
          {activeTab === "requests" && (
            <div className="p-4 flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {isLoadingRequests ? (
                  <div className="py-12 text-center">
                    <span className="loading loading-spinner loading-md text-primary" />
                    <p className="text-xs text-base-content/50 mt-2">Loading requests...</p>
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="py-12 text-center text-base-content/50 space-y-2">
                    <Inbox className="w-10 h-10 mx-auto opacity-30 text-primary" />
                    <h4 className="text-sm font-bold text-base-content">No Pending Requests</h4>
                    <p className="text-xs max-w-xs mx-auto">
                      When someone sends you a friend request, it will show up here for you to accept!
                    </p>
                  </div>
                ) : (
                  pendingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          src={req.sender?.profilePic}
                          name={req.sender?.fullName}
                          size="w-11 h-11"
                          textSize="text-sm"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-base-content truncate">
                            {req.sender?.fullName || "User"}
                          </h4>
                          <p className="text-[11px] text-base-content/50 truncate">
                            Wants to connect with you
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => acceptFriendRequest(req._id, req.sender)}
                          className="btn btn-success btn-sm rounded-xl text-white font-semibold gap-1 shadow-sm text-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => rejectFriendRequest(req._id)}
                          className="btn btn-ghost btn-sm rounded-xl text-base-content/60 hover:text-error hover:bg-error/10 text-xs"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="p-3 border-t border-base-300/60 bg-base-200/30 text-center">
            <p className="text-[11px] text-base-content/50 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary" />
              Messaging is enabled once both users accept the connection.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddFriendModal;
