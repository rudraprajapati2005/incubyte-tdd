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
      .send({ email: "test@example.com", password: "123456" });

    // Your controller uses 200, not 201
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
  it("should fail if email is missing ", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail if password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
