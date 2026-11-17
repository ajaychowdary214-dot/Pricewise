import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { wrap, httpError } from "../utils/asyncHandler.js";

const router = Router();
const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e || "");
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });

router.post("/register", wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || name.trim().length < 2) throw httpError(400, "Enter your name");
  if (!emailOk(email)) throw httpError(400, "Enter a valid email address");
  if (!password || password.length < 6) throw httpError(400, "Password must be at least 6 characters");
  if (await User.findOne({ email: email.toLowerCase() })) throw httpError(409, "An account with this email already exists");
  const user = await User.create({ name: name.trim(), email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
}));

router.post("/login", wrap(async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || "").toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) throw httpError(401, "Email or password is incorrect");
  res.json({ token: sign(user), user: publicUser(user) });
}));

router.get("/me", requireAuth, wrap(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw httpError(401, "Please login again");
  res.json(publicUser(user));
}));

export default router;
