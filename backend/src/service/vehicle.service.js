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

}

export default new VehicleService();