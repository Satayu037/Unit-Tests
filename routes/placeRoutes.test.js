const request = require("supertest");
const express = require("express");

// ใช้ Proxy เพื่อรองรับทุกฟังก์ชันใน placeController (เช่น getAllMoods, getPlacesByMood ฯลฯ)
jest.mock("../controllers/placeController", () => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === "getAllPlaces") {
        return jest.fn((req, res) => res.status(200).json([{ id: 1, name: "คาเฟ่แมว" }]));
      }
      if (prop === "getPlaceById") {
        return jest.fn((req, res) => res.status(200).json({ id: 1, name: "คาเฟ่แมว" }));
      }
      // ฟังก์ชันอื่นๆ ที่ Router เรียกใช้ ให้คืน Mock Function ค่าเริ่มต้น
      return jest.fn((req, res) => res.status(200).json({ success: true }));
    }
  });
});

// Mock Middleware กรณีที่ placeRoutes มีการใช้ Auth Middleware ดักไว้
jest.mock("../middleware/authMiddleware", () => ({
  protect: (req, res, next) => next(),
  adminOnly: (req, res, next) => next(),
}), { virtual: true });

const placeRoutes = require("./placeRoutes");

const app = express();
app.use(express.json());
app.use("/api/v1/places", placeRoutes);

describe("3. Place Routes Integration Tests", () => {
  test("GET /api/v1/places", async () => {
    const res = await request(app).get("/api/v1/places");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/v1/places/:id", async () => {
    const res = await request(app).get("/api/v1/places/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("คาเฟ่แมว");
  });
});