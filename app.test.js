const request = require("supertest");

// Mock lib/socket เพื่อไม่ให้ติดปัญหา Redis/Socket ตอนรัน
jest.mock("./lib/socket", () => {
  const express = require("express");
  return {
    app: express(),
    server: {},
    io: { to: jest.fn().mockReturnValue({ emit: jest.fn() }) },
  };
});

const app = require("./app");

describe("1. Basic App Health Check", () => {
  test("GET / ควรตอบกลับ HTTP 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  test("GET Route ที่ไม่มีอยู่จริง ควรตอบกลับ HTTP 404", async () => {
    const res = await request(app).get("/api/v1/unknown-route-xyz");
    expect(res.statusCode).toBe(404);
  });
});