import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepository from "../repository/user.repository.js";

class AuthService {
  async registerUser({ email, password }) {
    const existing = await userRepository.findByEmail( email );
    if (existing) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating the new User
    const user = await userRepository.create({ email, password: hashedPassword });

    // Generate JWT ()
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return { token };
  }
}

export  default new AuthService();
