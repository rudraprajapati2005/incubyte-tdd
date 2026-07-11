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

export const putVehicle = async(req ,res, next) => {
    try{

        const updatedVehicle = await VehicleService.updateVehicleById(req.params.id , req.body);
        res.status(200).json(updatedVehicle);
    }
    catch(err)
    {
        next(err);
    }
}
