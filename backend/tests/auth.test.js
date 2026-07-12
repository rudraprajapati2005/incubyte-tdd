import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("POST /api/auth/register", () => {
  // Connect to test DB before running tests
  beforeAll(async () => {
    await mongoose.connect(
      process.env.TEST_DB_URI || "mongodb://127.0.0.1:27017/IncubVentTest"
    );
  });

  // Clean up users between tests
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Disconnect after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user and return JWT", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Rudra Prajapati", email: "test@example.com", password: "Valid@12356" });

    expect(res.statusCode).toBe(200); // controller uses 200
    expect(res.body).toHaveProperty("token");
  });

  it("should fail if email is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Rudra Prajapati", password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail if password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Rudra Prajapati", email: "test@example.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail if user already exists", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Rudra Prajapati", email: "test@example.com", password: "Valid@12356" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Rudra Prajapati", email: "test@example.com", password: "Valid@12356" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "User already exists");
  });

  it("should fail if email format is invalid", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Rudra Prajapati", email: "invalidEmail", password: "Valid@12356" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid email format");
  });

  it("should fail if password does not meet complexity rules", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Rudra Prajapati", email: "test@example.com", password: "weakpass" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Password must be at least 8 characters, contain one uppercase letter, and one special character"
    );
  });
});
