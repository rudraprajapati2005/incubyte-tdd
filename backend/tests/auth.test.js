import request from "supertest";
import app from "../src/app";

describe("POST /api/auth/register", () => {
  it("should register a new user and return JWT", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});
