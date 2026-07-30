const request = require("supertest");
const express = require("express");

// ใช้ Proxy เพื่อรองรับทุกฟังก์ชันใน authController (เช่น verifyEmail, forgotPassword ฯลฯ)
jest.mock("../controllers/authController", () => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === "login") {
        return jest.fn((req, res) => res.status(200).json({ token: "mock-jwt-token" }));
      }
      if (prop === "register") {
        return jest.fn((req, res) => res.status(201).json({ message: "Registered" }));
      }
      // ฟังก์ชันอื่นๆ ที่ Router เรียกใช้ ให้คืน Mock Function ค่าเริ่มต้น
      return jest.fn((req, res) => res.status(200).json({ success: true }));
    }
  });
});

const authRoutes = require("./authRoutes");

const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRoutes);

describe("2. Auth Routes Integration Tests", () => {
  test("POST /api/v1/auth/login", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/v1/auth/register", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Dev", email: "dev@example.com", password: "123" });

    expect(res.statusCode).toBe(201);
  });
});