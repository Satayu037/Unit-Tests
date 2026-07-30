const request = require("supertest");
const express = require("express");

jest.mock("../controllers/aiSearchController", () => {
  return new Proxy({}, {
    get: () => jest.fn((req, res) => res.status(200).json({ emotion: "relax", places: [] }))
  });
});

const aiSearchRoutes = require("./aiSearchRoutes");
const app = express();
app.use(express.json());
app.use("/api/v1/ai", aiSearchRoutes);

describe("AI Search Routes Integration Tests", () => {
  test("POST /api/v1/ai/analyze-emotion", async () => {
    const res = await request(app).post("/api/v1/ai/analyze-emotion").send({ text: "เหนื่อยมาก" });
    expect(res.statusCode).toBe(200);
  });
});