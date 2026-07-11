import * as vehicleRepository from  "../repository/vehicle.repository.js";


class VehicleService {
  async addVehicle(data) {

    const vehicle = await vehicleRepository.create(data);
    return { id: vehicle._id };
  }

}

export default new VehicleService();