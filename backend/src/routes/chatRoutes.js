import express from "express";
import { getStreamToken, syncUser } from "../controllers/chatController.js";
import { executeCode } from "../controllers/codeController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// Sync user - requires Clerk auth but not DB user yet
router.post("/sync-user", requireAuth(), syncUser);

// Get token - protected route (user must exist in DB)
router.get("/token", protectRoute, getStreamToken);

// Execute code - protected route (user must be authenticated)
router.post("/execute", protectRoute, executeCode);

export default router;
