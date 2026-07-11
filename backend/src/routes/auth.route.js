import express from "express";
import { registerUser , loginUser } from "../controller/auth.controller.js";
import { validateRegisterInput } from "../middlewares/validateRegisterInput.js";

const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);
router.post("/login" , loginUser);

export default router;
