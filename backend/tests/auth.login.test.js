import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import bcrypt from "bcryptjs";

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.TEST_DB_URI || "mongodb://127.0.0.1:27017/IncubVentTest"
    );
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Seed a dummy user for login testing
    const hashedPassword = await bcrypt.hash("Valid@12356", 10);
    await User.create({
      email: "existinguser@example.com",
      password: hashedPassword,
      role: "user" 
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should login successfully with valid credentials and return JWT", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "existinguser@example.com", password: "Valid@12356" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

   it("should fail if email or password fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "existinguser@example.com" }); // Missing password

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
  it("should fail if the email does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nonexistent@example.com", password: "Valid@12356" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

});