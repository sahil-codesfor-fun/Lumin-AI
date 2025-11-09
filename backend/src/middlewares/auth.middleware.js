import { verifyToken } from "../config/jwt.js";

export const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No auth header" });
    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Malformed token" });

    const payload = verifyToken(token);
    req.user = payload; // { id: ... }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
