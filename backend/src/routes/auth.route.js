import express from "express";
import { registerUser } from "../controller/auth.controller.js";
import { validateRegisterInput } from "../middleware/validateRegisterInput.js";

const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);

export default router;
