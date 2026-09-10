import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getDiscoverUsers,
  getPendingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.get("/discover", protectRoute, getDiscoverUsers);
router.get("/requests", protectRoute, getPendingRequests);
router.post("/request/:id", protectRoute, sendFriendRequest);
router.post("/accept/:id", protectRoute, acceptFriendRequest);
router.post("/reject/:id", protectRoute, rejectFriendRequest);
router.post("/cancel/:id", protectRoute, cancelFriendRequest);

export default router;
