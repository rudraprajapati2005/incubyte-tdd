import request from "supertest";
import app from "../src/app.js";

describe("Vehicle API", () => {
  it("should add a new vehicle", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({
        make: "Toyota",
        model: "Corolla",
        category: "Sedan",
        price: 20000,
        quantity: 5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

});
