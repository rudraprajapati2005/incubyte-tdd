import AuthService from "../service/auth.service.js";
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.registerUser({ email, password });
    res.status(200).json(result); // 201 Created is more RESTful
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" + error });
  }
};