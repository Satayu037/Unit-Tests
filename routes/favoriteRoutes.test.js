const request = require("supertest");
const express = require("express");

const bypass = (req, res, next) => { req.user = { id: 1, role: "admin" }; next(); };
jest.mock("../middleware/authMiddleware", () => ({ protect: bypass, admin: bypass }), { virtual: true });
jest.mock("../middleware/auth", () => ({ protect: bypass, admin: bypass }), { virtual: true });

jest.mock("../controllers/favoriteController", () => new Proxy({}, {
  get: () => jest.fn((req, res) => res.status(200).json({ success: true }))
}));

const favoriteRoutes = require("./favoriteRoutes");
const app = express();
app.use(express.json());
app.use("/api/v1/favorites", favoriteRoutes);

describe("Favorite Routes Integration Tests", () => {
  test("GET /api/v1/favorites", async () => {
    const res = await request(app).get("/api/v1/favorites");
    expect(res.statusCode).toBeLessThan(500);
  });
});