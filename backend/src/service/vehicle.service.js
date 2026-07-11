import * as vehicleRepository from  "../repository/vehicle.repository.js";


class VehicleService {
  async addVehicle(data) {

    const vehicle = await vehicleRepository.create(data);
    return { id: vehicle._id };
  }

  async getVehicles(){
    const vehicles = await vehicleRepository.findAll();
    return vehicles;
  }
  async updateVehicleById( id ,data)
  {
    if (data.price !== undefined && data.price <= 0) {
      throw new ErrorResponse("INVALID_PRICE", "Price must be greater than 0", 400);
    }
    if (data.quantity !== undefined && data.quantity < 0) {
      throw new ErrorResponse("INVALID_QUANTITY", "Quantity cannot be negative", 400);
    }

    const updatedVehicle = await vehicleRepository.updateById(id,data);

    if (!updatedVehicle) {
      throw new ErrorResponse("NOT_FOUND", "Vehicle not found", 404);
    }

    return updatedVehicle;
  }
  
}

export default new VehicleService();