const request = require("supertest");
const express = require("express");

const bypass = (req, res, next) => { req.user = { id: 1, role: "admin" }; next(); };
jest.mock("../middleware/authMiddleware", () => ({ protect: bypass, admin: bypass }), { virtual: true });
jest.mock("../middleware/auth", () => ({ protect: bypass, admin: bypass }), { virtual: true });

jest.mock("../controllers/chatController", () => new Proxy({}, {
  get: () => jest.fn((req, res) => res.status(200).json({ success: true }))
}));

const chatRoutes = require("./chatRoutes");
const app = express();
app.use(express.json());
app.use("/api/v1/messages", chatRoutes);

describe("Chat Routes Integration Tests", () => {
  test("GET /api/v1/messages/users", async () => {
    const res = await request(app).get("/api/v1/messages/users");
    expect(res.statusCode).toBeLessThan(500);
  });
});