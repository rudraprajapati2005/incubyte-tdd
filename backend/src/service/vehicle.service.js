import * as vehicleRepository from  "../repository/vehicle.repository.js";
import ErrorResponse from "../errorHandler/errorResponse.js";


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

   async searchVehicles(query) {
    return await vehicleRepository.search(query);
  }

  async deleteVehicleById(id) {
    const deleted = await vehicleRepository.deleteById(id);
    if (!deleted) {
      throw new ErrorResponse("NOT_FOUND", "Vehicle not found", 404);
    }
    return deleted;
  }

  async purchaseVehicle(id, qty) {
    //checking the Quantity before purchasing
  if (qty <= 0) {
    throw new ErrorResponse("INVALID_QUANTITY", "Purchase quantity must be positive", 400);
  }
  return await vehicleRepository.purchase(id, qty);
}

async restockVehicle(id, qty) {

  //Admin cannot enter a negative value for the quatity while reStocking
  if (qty <= 0) {
    throw new ErrorResponse("INVALID_QUANTITY", "Restock quantity must be positive", 400);
  }
  return await vehicleRepository.restock(id, qty);
}

  
}

export default new VehicleService();