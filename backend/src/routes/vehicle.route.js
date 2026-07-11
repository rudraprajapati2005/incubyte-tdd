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

const router = express.Router();
router.post("/", addVehicle);
router.get("/", getVehicles);
router.put("/:id", putVehicle);
router.get("/search", searchVehicles);
router.delete("/:id", deleteVehicle);
router.post("/:id/purchase", purchaseVehicle);
router.post("/:id/restock", restockVehicle);

export default router;
