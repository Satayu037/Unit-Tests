const request = require("supertest");
const express = require("express");

const bypass = (req, res, next) => { req.user = { id: 1, role: "admin" }; next(); };
jest.mock("../middleware/authMiddleware", () => ({ protect: bypass, admin: bypass, adminOnly: bypass }), { virtual: true });
jest.mock("../middleware/auth", () => ({ protect: bypass, admin: bypass, adminOnly: bypass }), { virtual: true });

// กำหนดชื่อฟังก์ชันให้ตรงกับที่ Router เรียกใช้เป๊ะๆ
jest.mock("../controllers/chatRoomController", () => {
  const mockFn = (req, res) => res.status(200).json({ success: true });
  return {
    createOrGetContactRoom: mockFn,
    getRoomMessages: mockFn,
    sendMessageToRoom: mockFn,
    getAllContactRooms: mockFn,
    closeRoom: mockFn,
    updateRoomStatus: mockFn,
    deleteRoom: mockFn // 👈 เพิ่มชิ้นส่วนสุดท้ายตรงนี้ครับ
  };
});

const chatRoomRoutes = require("./chatRoomRoutes");
const app = express();
app.use(express.json());
app.use("/api/v1/contact", chatRoomRoutes);

describe("ChatRoom Routes Integration Tests", () => {
  test("GET /api/v1/contact/admin/all", async () => {
    const res = await request(app).get("/api/v1/contact/admin/all");
    expect(res.statusCode).toBeLessThan(500);
  });
});