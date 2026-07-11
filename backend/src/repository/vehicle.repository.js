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

export const search = async (query) => Vehicle.find(query);

export const deleteById = async (id) => Vehicle.findByIdAndDelete(id);

export const purchase = async (id, qty) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle || vehicle.quantity < qty) throw new Error("Not enough stock");
  vehicle.quantity -= qty;
  return vehicle.save();
};

export const restock = async (id, qty) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) throw new Error("Not found");
  vehicle.quantity += qty;
  return vehicle.save();
};
