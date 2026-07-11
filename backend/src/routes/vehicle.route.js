import express from "express";
import { addVehicle, getVehicles, putVehicle } from "../controller/vehicle.controller.js";

const router = express.Router();

router.post("/", addVehicle);
router.get("/", getVehicles);
router.put("/:id", putVehicle);
export default router;
