import Vehicle from "../models/Vehicle.js";


export const create = async(vehicle)=>{
    return Vehicle.create(vehicle);
}

export const findAll = async () => {
  return await Vehicle.find();
};