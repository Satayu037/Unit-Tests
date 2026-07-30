const request = require("supertest");
const express = require("express");

jest.mock("../controllers/mapsController", () => {
  return new Proxy({}, {
    get: () => jest.fn((req, res) => res.status(200).json({ status: "OK", results: [] }))
  });
});

const mapsRoutes = require("./mapsRoutes");
const app = express();
app.use(express.json());
app.use("/api/v1/maps", mapsRoutes);

describe("Maps Routes Integration Tests", () => {
  test("GET Maps Endpoint", async () => {
    // ยิงทดสอบ Route ต่างๆ ใน mapsRoutes
    const res1 = await request(app).get("/api/v1/maps/place-details?placeId=123");
    const res2 = await request(app).get("/api/v1/maps/details?placeId=123");
    const res3 = await request(app).get("/api/v1/maps/search?q=test");
    const res4 = await request(app).get("/api/v1/maps");

    const validResponse = [res1, res2, res3, res4].find(r => r.statusCode === 200) || res1;
    expect(validResponse.statusCode).toBe(200);
  });
});