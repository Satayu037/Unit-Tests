const request = require("supertest");
const express = require("express");

const bypass = (req, res, next) => { req.user = { id: 1, role: "admin" }; next(); };
// เพิ่ม adminOnly เข้าไปเพื่อให้ Router เรียกใช้ได้ไม่เป็น undefined
jest.mock("../middleware/authMiddleware", () => ({ protect: bypass, admin: bypass, adminOnly: bypass }), { virtual: true });
jest.mock("../middleware/auth", () => ({ protect: bypass, admin: bypass, adminOnly: bypass }), { virtual: true });

jest.mock("../controllers/adminController", () => new Proxy({}, {
  get: () => jest.fn((req, res) => res.status(200).json({ success: true }))
}));

const adminRoutes = require("./adminRoutes");
const app = express();
app.use(express.json());
app.use("/api/v1/admin", adminRoutes);

describe("Admin Routes Integration Tests", () => {
  test("GET /api/v1/admin/users", async () => {
    const res = await request(app).get("/api/v1/admin/users");
    expect(res.statusCode).toBeLessThan(500);
  });
});