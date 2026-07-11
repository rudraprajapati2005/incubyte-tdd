import VehicleService from "../service/vehicle.service.js";

export const addVehicle = async (req, res, next) => {
  try {
    const vehicle = await VehicleService.addVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
};

export const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await VehicleService.getVehicles();
    res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};
