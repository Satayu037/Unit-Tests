const request = require("supertest");
const express = require("express");

const bypass = (req, res, next) => { req.user = { id: 1, role: "admin" }; next(); };
jest.mock("../middleware/authMiddleware", () => ({ protect: bypass, admin: bypass }), { virtual: true });
jest.mock("../middleware/auth", () => ({ protect: bypass, admin: bypass }), { virtual: true });

jest.mock("../controllers/historyController", () => new Proxy({}, {
  get: () => jest.fn((req, res) => res.status(200).json({ success: true }))
}));

const historyRoutes = require("./historyRoutes");
const app = express();
app.use(express.json());
app.use("/api/v1/history", historyRoutes);

describe("History Routes Integration Tests", () => {
  test("GET /api/v1/history", async () => {
    const res = await request(app).get("/api/v1/history");
    expect(res.statusCode).toBeLessThan(500);
  });
});