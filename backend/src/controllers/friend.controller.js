import User from "../models/user.model.js";
import Friendship from "../models/friendship.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// 1. Get all registered users with their friendship relationship status
export const getDiscoverUsers = async (req, res) => {
  try {
    const myId = req.user._id;

    // Fetch all other users
    const allUsers = await User.find({ _id: { $ne: myId } })
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 });

    // Fetch all friendships involving the logged-in user
    const friendships = await Friendship.find({
      $or: [{ sender: myId }, { receiver: myId }],
    });

    // Map each user to their relationship status
    const usersWithStatus = allUsers.map((user) => {
      const userObj = user.toObject();

      const friendship = friendships.find(
        (f) =>
          (f.sender.toString() === myId.toString() && f.receiver.toString() === user._id.toString()) ||
          (f.receiver.toString() === myId.toString() && f.sender.toString() === user._id.toString())
      );

      if (!friendship) {
        userObj.friendStatus = "none";
      } else if (friendship.status === "accepted") {
        userObj.friendStatus = "friends";
        userObj.friendshipId = friendship._id;
      } else if (friendship.status === "pending") {
        if (friendship.sender.toString() === myId.toString()) {
          userObj.friendStatus = "sent";
          userObj.friendshipId = friendship._id;
        } else {
          userObj.friendStatus = "received";
          userObj.friendshipId = friendship._id;
        }
      } else {
        userObj.friendStatus = "none";
      }

      return userObj;
    });

    res.status(200).json(usersWithStatus);
  } catch (error) {
    console.error("Error in getDiscoverUsers:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Get incoming pending friend requests
export const getPendingRequests = async (req, res) => {
  try {
    const myId = req.user._id;

    const requests = await Friendship.find({
      receiver: myId,
      status: "pending",
    })
      .populate("sender", "_id fullName profilePic email createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error in getPendingRequests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: targetUserId } = req.params;

    if (myId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // Check existing friendship in either direction
    let existing = await Friendship.findOne({
      $or: [
        { sender: myId, receiver: targetUserId },
        { sender: targetUserId, receiver: myId },
      ],
    });

    if (existing) {
      if (existing.status === "accepted") {
        return res.status(400).json({ message: "You are already friends" });
      }
      if (existing.status === "pending") {
        return res.status(400).json({ message: "Friend request already exists" });
      }
      // If rejected, reset to pending with current user as sender
      existing.sender = myId;
      existing.receiver = targetUserId;
      existing.status = "pending";
      await existing.save();
    } else {
      existing = new Friendship({
        sender: myId,
        receiver: targetUserId,
        status: "pending",
      });
      await existing.save();
    }

    // Notify target user via Socket.IO
    const receiverSocketId = getReceiverSocketId(targetUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", {
        _id: existing._id,
        sender: {
          _id: req.user._id,
          fullName: req.user.fullName,
          profilePic: req.user.profilePic,
          email: req.user.email,
        },
        createdAt: existing.createdAt,
      });
    }

    res.status(200).json({ message: "Friend request sent successfully", friendship: existing });
  } catch (error) {
    console.error("Error in sendFriendRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id } = req.params; // Can be friendship _id or sender _id

    const friendship = await Friendship.findOne({
      $or: [
        { _id: id, receiver: myId },
        { sender: id, receiver: myId },
      ],
      status: "pending",
    }).populate("sender", "_id fullName profilePic email");

    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    friendship.status = "accepted";
    await friendship.save();

    // Real-time notification to the original sender
    const senderSocketId = getReceiverSocketId(friendship.sender._id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("friendRequestAccepted", {
        user: {
          _id: req.user._id,
          fullName: req.user.fullName,
          profilePic: req.user.profilePic,
          email: req.user.email,
        },
        friendshipId: friendship._id,
      });
    }

    res.status(200).json({
      message: "Friend request accepted! You can now chat.",
      friend: friendship.sender,
      friendship,
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5. Reject or Decline friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id } = req.params;

    const friendship = await Friendship.findOneAndDelete({
      $or: [
        { _id: id, receiver: myId },
        { sender: id, receiver: myId },
      ],
    });

    if (!friendship) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Notify sender that request was declined/cancelled
    const senderSocketId = getReceiverSocketId(friendship.sender);
    if (senderSocketId) {
      io.to(senderSocketId).emit("friendRequestRejected", {
        friendshipId: friendship._id,
      });
    }

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.error("Error in rejectFriendRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 6. Cancel a sent friend request
export const cancelFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: targetUserId } = req.params;

    const friendship = await Friendship.findOneAndDelete({
      sender: myId,
      $or: [{ receiver: targetUserId }, { _id: targetUserId }],
      status: "pending",
    });

    if (!friendship) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Notify receiver that request was withdrawn
    const receiverSocketId = getReceiverSocketId(friendship.receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestCancelled", {
        friendshipId: friendship._id,
      });
    }

    res.status(200).json({ message: "Friend request cancelled" });
  } catch (error) {
    console.error("Error in cancelFriendRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
