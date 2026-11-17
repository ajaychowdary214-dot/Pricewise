import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET || "dev-secret").id;
    next();
  } catch {
    res.status(401).json({ message: "Please login first" });
  }
}
