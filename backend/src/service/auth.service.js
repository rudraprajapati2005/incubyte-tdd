import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepository from "../repository/user.repository.js";
import ErrorResponse from "../errorHandler/errorResponse.js";
class AuthService {
  async registerUser({ email, password }) {
    const existing = await userRepository.findByEmail( email );
    if (existing) {
      //added the custom error Response
      throw new ErrorResponse("User already exists" ,"User already exists" , 400);
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

  async loginUser({ email, password }) {

    if (!password) {
        throw new ErrorResponse(
            "INVALID_PASSWORD",
            "Password field is empty",
            400
        );
    }
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new ErrorResponse(
            "INVALID_CREDENTIALS",
            "Invalid credentials",
            400
        );
    }
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );
    if (!isPasswordValid) {
        throw new ErrorResponse(
            "INVALID_CREDENTIALS",
            "Invalid credentials",
            400
        );
    }
    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET || "secret",
        {
            expiresIn: "1d"
        }
    );
    return { token };
}
}
export  default new AuthService();
