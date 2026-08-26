import { asyncHandler } from "../lib/asyncHandler.js";
import { getUserFromRequest } from "../lib/sessions.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.user = user;
  next();
});
