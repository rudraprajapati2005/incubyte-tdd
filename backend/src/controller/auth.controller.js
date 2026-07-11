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

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.loginUser({ email, password });
    res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};