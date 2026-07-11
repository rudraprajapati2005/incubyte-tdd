import express from "express";
import { addVehicle, getVehicles } from "../controller/vehicle.controller.js";

const router = express.Router();

router.post("/", addVehicle);
router.get("/", getVehicles);

export default router;
