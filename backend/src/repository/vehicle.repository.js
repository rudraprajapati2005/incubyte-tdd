import Vehicle from "../models/Vehicle.js";


export const create = async(vehicle)=>{
    return Vehicle.create(vehicle);
}

export const findAll = async () => {
  return await Vehicle.find();
};

export const updateById = async (id, data) => {
  return await Vehicle.findByIdAndUpdate(id, data, {
    new: true,          // return updated doc
    runValidators: true // enforce schema validation
  });
};