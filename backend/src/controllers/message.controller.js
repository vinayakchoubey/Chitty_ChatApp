import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Friendship from "../models/friendship.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all accepted friendships
    const acceptedFriendships = await Friendship.find({
      $or: [
        { sender: loggedInUserId, status: "accepted" },
        { receiver: loggedInUserId, status: "accepted" },
      ],
    });

    const friendIds = acceptedFriendships.map((f) =>
      f.sender.toString() === loggedInUserId.toString() ? f.receiver : f.sender
    );

    // Also include users who already have message history with the user
    const pastMessages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    }).select("senderId receiverId");

    pastMessages.forEach((m) => {
      const otherId = m.senderId.toString() === loggedInUserId.toString() ? m.receiverId : m.senderId;
      if (!friendIds.some((id) => id.toString() === otherId.toString())) {
        friendIds.push(otherId);
      }
    });

    const friends = await User.find({ _id: { $in: friendIds } }).select("-password -otp -otpExpiry");

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check if friendship is accepted or if prior conversation exists
    const isFriend = await Friendship.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: "accepted" },
        { sender: receiverId, receiver: senderId, status: "accepted" },
      ],
    });

    if (!isFriend) {
      const hasPriorChat = await Message.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      if (!hasPriorChat) {
        return res.status(403).json({ message: "You can only message accepted friends." });
      }
    }

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};