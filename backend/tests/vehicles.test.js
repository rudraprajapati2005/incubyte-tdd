import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";

describe("Vehicle API", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.TEST_DB_URI || "mongodb://127.0.0.1:27017/IncubVentTest"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should add a new vehicle", async () => {
    const res = await request(app)
      .post("/api/vehicles")
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
  const res = await request(app).get("/api/vehicles");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});


});
