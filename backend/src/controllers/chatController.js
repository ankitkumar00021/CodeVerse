import { chatClient } from "../lib/stream.js";
import User from "../models/User.js";

export async function syncUser(req, res) {
  try {
    const clerkId = req.auth?.userId;
    const { name, email, image } = req.body;

    console.log("Sync User - ClerkId:", clerkId);

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - no Clerk ID" });
    }

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Find or create user in database
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user if data changed
      user.name = name;
      user.email = email;
      user.profileImage = image || "";
      await user.save();
      console.log("User updated:", user._id);
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        profileImage: image || "",
        clerkId,
      });
      console.log("New user created:", user._id);
    }

    res.status(200).json({ user, message: "User synced successfully" });
  } catch (error) {
    console.error("Error in syncUser controller:", error.message);
    res.status(500).json({ message: "Failed to sync user: " + error.message });
  }
}

export async function getStreamToken(req, res) {
  try {
    // use clerkId for Stream (not mongodb _id)=> it should match the id we have in the stream dashboard
    const token = chatClient.createToken(req.user.clerkId);

    res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.profileImage,
    });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
