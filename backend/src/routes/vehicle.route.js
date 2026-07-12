import express from "express";

import {
  addVehicle,
  getVehicles,
  putVehicle,
  searchVehicles,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
} from "../controller/vehicle.controller.js";
import {authMiddleware , adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();
// Inventory management is admin-only; regular users can browse and purchase.
router.post("/", authMiddleware, adminOnly, addVehicle);
router.get("/", authMiddleware,getVehicles);
router.put("/:id",authMiddleware , adminOnly,putVehicle);
router.get("/search",authMiddleware ,searchVehicles);
router.delete("/:id",authMiddleware ,adminOnly,deleteVehicle);
router.post("/:id/purchase",authMiddleware ,purchaseVehicle);
router.post("/:id/restock", authMiddleware , adminOnly ,restockVehicle);

export default router;
