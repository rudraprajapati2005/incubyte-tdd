import Vehicle from "../models/Vehicle.js";

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchQuery(query = {}) {
  const filter = {};
  const textTerms = [];

  if (query.q) {
    textTerms.push(query.q);
  }
  if (query.make) {
    textTerms.push(query.make);
  }
  if (query.model) {
    textTerms.push(query.model);
  }

  if (textTerms.length > 0) {
    filter.$or = textTerms.map((term) => ({
      $or: [
        { make: { $regex: escapeRegex(term), $options: "i" } },
        { model: { $regex: escapeRegex(term), $options: "i" } },
      ],
    }));
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice !== undefined && query.minPrice !== "") {
    filter.price = { ...(filter.price || {}), $gte: Number(query.minPrice) };
  }

  if (query.maxPrice !== undefined && query.maxPrice !== "") {
    filter.price = { ...(filter.price || {}), $lte: Number(query.maxPrice) };
  }

  return filter;
}


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

export const search = async (query) => Vehicle.find(buildSearchQuery(query));

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
