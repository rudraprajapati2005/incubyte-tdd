import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";

let token; // store JWT
// jest.setup.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
 console.log.print
describe("Vehicle API", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.TEST_DB_URI || "mongodb://127.0.0.1:27017/IncubVentTest"
    );

    // Login as admin user (already seeded in DB)
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "testadmin@gmail.com", password: "pass123" });
    console.log("Login response:", loginRes.body);

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should add a new vehicle", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Toyota",
        model: "Corolla",
        category: "SEDAN",
        price: 20000,
        quantity: 5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should list all vehicles", async () => {
    const res = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a vehicle", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Honda", model: "Civic", category: "SEDAN", price: 18000, quantity: 3 });

    const vehicleId = createRes.body.id;

    const updateRes = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 19000 });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.price).toBe(19000);
  });

  it("should search vehicles by make", async () => {
    const res = await request(app)
      .get("/api/vehicles/search?make=Toyota")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should delete a vehicle (admin only)", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Ford", model: "Focus", category: "SEDAN", price: 15000, quantity: 5 });

    const vehicleId = createRes.body.id;

    const delRes = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(delRes.statusCode).toBe(204);
  });

  it("should purchase a vehicle", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Honda", model: "City", category: "SEDAN", price: 18000, quantity: 10 });

    const vehicleId = createRes.body.id;

    const purchaseRes = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 2 });

    expect(purchaseRes.statusCode).toBe(200);
    expect(purchaseRes.body.quantity).toBe(8);
  });

  it("should restock a vehicle (admin only)", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Nissan", model: "Sunny", category: "SEDAN", price: 17000, quantity: 5 });

    const vehicleId = createRes.body.id;

    const restockRes = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 3 });

    expect(restockRes.statusCode).toBe(200);
    expect(restockRes.body.quantity).toBe(8);
  });
});
