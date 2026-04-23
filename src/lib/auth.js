import jwt from "jsonwebtoken";
import { AppError } from "./errors.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("[warn] JWT_SECRET not set — auth will fail. Set JWT_SECRET in .env");
}

export const signToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
};

// Required auth — throws 401 if no valid token
export const requireAuth = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or invalid Authorization header"));
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return next(new AppError(401, "Invalid or expired token"));
  }
};

// Optional auth — attaches req.userId if present, but doesn't block
export const optionalAuth = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();
  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
  } catch {
    // silently ignore bad tokens for optional auth
  }
  next();
};
