import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useFriendStore = create((set, get) => ({
  discoverUsers: [],
  pendingRequests: [],
  isAddFriendOpen: false,
  isLoadingDiscover: false,
  isLoadingRequests: false,
  pendingCount: 0,

  setIsAddFriendOpen: (isOpen) => {
    set({ isAddFriendOpen: isOpen });
    if (isOpen) {
      get().getDiscoverUsers();
      get().getPendingRequests();
    }
  },

  getDiscoverUsers: async () => {
    set({ isLoadingDiscover: true });
    try {
      const res = await axiosInstance.get("/friends/discover");
      set({ discoverUsers: res.data });
    } catch (error) {
      console.error("Error fetching discover users:", error);
    } finally {
      set({ isLoadingDiscover: false });
    }
  },

  getPendingRequests: async () => {
    set({ isLoadingRequests: true });
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({
        pendingRequests: res.data,
        pendingCount: res.data.length,
      });
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      set({ isLoadingRequests: false });
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      await axiosInstance.post(`/friends/request/${userId}`);
      toast.success("Friend request sent!");
      // Update discover state immediately
      set({
        discoverUsers: get().discoverUsers.map((u) =>
          u._id === userId ? { ...u, friendStatus: "sent" } : u
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  acceptFriendRequest: async (requestId, friendData = null) => {
    try {
      const res = await axiosInstance.post(`/friends/accept/${requestId}`);
      toast.success(res.data.message || "Friend request accepted!");

      // Update pending requests list & badge
      set({
        pendingRequests: get().pendingRequests.filter((r) => r._id !== requestId && r.sender?._id !== requestId),
        pendingCount: Math.max(0, get().pendingCount - 1),
      });

      // Update discover list
      const friendId = friendData?._id || res.data.friend?._id;
      if (friendId) {
        set({
          discoverUsers: get().discoverUsers.map((u) =>
            u._id === friendId ? { ...u, friendStatus: "friends" } : u
          ),
        });
      }

      // Refresh sidebar contacts in useChatStore
      useChatStore.getState().getUsers();

      // If user passed, select the new friend to chat immediately!
      if (friendData) {
        useChatStore.getState().setSelectedUser(friendData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  },

  rejectFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post(`/friends/reject/${requestId}`);
      toast.info("Friend request declined");

      set({
        pendingRequests: get().pendingRequests.filter((r) => r._id !== requestId && r.sender?._id !== requestId),
        pendingCount: Math.max(0, get().pendingCount - 1),
      });

      // Refresh discover users
      get().getDiscoverUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to decline request");
    }
  },

  cancelFriendRequest: async (userId) => {
    try {
      await axiosInstance.post(`/friends/cancel/${userId}`);
      toast.info("Friend request cancelled");

      set({
        discoverUsers: get().discoverUsers.map((u) =>
          u._id === userId ? { ...u, friendStatus: "none" } : u
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel request");
    }
  },

  // Socket.IO event listeners
  subscribeToFriendEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newFriendRequest", (request) => {
      toast.info(`👋 ${request.sender?.fullName || "Someone"} sent you a friend request!`);
      set((state) => ({
        pendingRequests: [request, ...state.pendingRequests.filter((r) => r._id !== request._id)],
        pendingCount: state.pendingCount + 1,
      }));
      get().getDiscoverUsers();
    });

    socket.on("friendRequestAccepted", (data) => {
      toast.success(`🎉 ${data.user?.fullName || "User"} accepted your friend request!`);
      // Automatically refresh contacts so new friend appears in sidebar!
      useChatStore.getState().getUsers();
      get().getDiscoverUsers();
    });

    socket.on("friendRequestRejected", () => {
      get().getDiscoverUsers();
    });

    socket.on("friendRequestCancelled", () => {
      get().getPendingRequests();
      get().getDiscoverUsers();
    });
  },

  unsubscribeFromFriendEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newFriendRequest");
    socket.off("friendRequestAccepted");
    socket.off("friendRequestRejected");
    socket.off("friendRequestCancelled");
  },
}));
