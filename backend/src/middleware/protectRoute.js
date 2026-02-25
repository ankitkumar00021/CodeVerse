import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth?.userId;

      console.log("ProtectRoute - ClerkId:", clerkId);
      console.log("ProtectRoute - AuthObject:", req.auth);

      if (!clerkId) {
        console.error("ProtectRoute - No clerkId found in auth");
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      // find user in db by clerk ID
      const user = await User.findOne({ clerkId });

      if (!user) {
        console.error("User not found in DB for clerkId:", clerkId);
        return res.status(404).json({
          message: "User not found - please refresh the page or login again",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("ProtectRoute error:", error.message);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },
];
