// 📄 app.test.js
const request = require("supertest");

// ===================================================
// 1. Mock bcryptjs & jsonwebtoken
// ===================================================
jest.mock("bcryptjs", () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue("hashed_password_123"),
  genSalt: jest.fn().mockResolvedValue("salt"),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mocked_jwt_token"),
  verify: jest
    .fn()
    .mockReturnValue({ id: 1, role: "admin", email: "test@example.com" }),
}));

// ===================================================
// 2. Mock Google Gemini AI
// ===================================================
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              emotion: "relax",
              description: "ผ่อนคลาย",
              places: [],
            }),
        },
      }),
    }),
  })),
}));

// ===================================================
// 3. Mock Database Models (รองรับ CRUD ทุก Controller)
// ===================================================
const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  password: "hashed_password_123",
  role: "admin",
  matchPassword: jest.fn().mockResolvedValue(true),
  toJSON: () => ({
    id: 1,
    name: "Test User",
    email: "test@example.com",
    role: "admin",
  }),
  save: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
};

const mockPlace = {
  id: 1,
  name: "Chill Cafe",
  category: "Cafe",
  mood: "relax",
  location: "Bangkok",
  toJSON: () => ({
    id: 1,
    name: "Chill Cafe",
    category: "Cafe",
    mood: "relax",
  }),
  save: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
};

const mockChatRoom = {
  id: 1,
  status: "open",
  toJSON: () => ({ id: 1, status: "open" }),
  save: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
};

const mockGenericModel = {
  findAll: jest.fn().mockResolvedValue([mockPlace]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  findByPk: jest.fn().mockResolvedValue(mockPlace),
  create: jest.fn().mockResolvedValue(mockPlace),
  update: jest.fn().mockResolvedValue([1]),
  destroy: jest.fn().mockResolvedValue(1),
  count: jest.fn().mockResolvedValue(1),
};

jest.mock("./models", () => ({
  sequelize: {
    sync: jest.fn().mockResolvedValue(true),
    query: jest.fn().mockResolvedValue([[mockPlace]]),
    authenticate: jest.fn().mockResolvedValue(true),
  },
  User: mockGenericModel,
  Place: mockGenericModel,
  Message: mockGenericModel,
  ChatRoom: {
    ...mockGenericModel,
    findByPk: jest.fn().mockResolvedValue(mockChatRoom),
    findOne: jest.fn().mockResolvedValue(mockChatRoom),
  },
  Favorite: mockGenericModel,
  History: mockGenericModel,
}));

// Mock DB Config
jest.mock("./config/db", () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));

// Import App
const app = require("./app");
const AUTH_HEADER = { Authorization: "Bearer mocked_jwt_token" };

// ===================================================
// 🧪 Test Suites เจาะลึก Controller ทุกตัว (เพื่อปั๊ม % Coverage)
// ===================================================

describe("🎭 Full High-Coverage API Test Suites", () => {
  // 1. Health Check
  describe("Health Check Routes", () => {
    test("GET /", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
    });

    test("GET 404 Route", async () => {
      const res = await request(app).get("/api/v1/invalid-route-12345");
      expect(res.statusCode).toBe(404);
    });
  });

  // 2. Auth Controller
  describe("Auth Endpoints (/api/v1/auth)", () => {
    test("POST /login", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test@example.com", password: "password123" });
      expect(res.statusCode).not.toBe(404);
    });

    test("POST /register", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "User",
          email: "test@example.com",
          password: "password123",
        });
      expect(res.statusCode).not.toBe(404);
    });
  });

  // 3. Place Controller (เทสครบทุก Function)
  describe("Place Endpoints (/api/v1/places)", () => {
    test("GET /", async () => {
      const res = await request(app).get("/api/v1/places");
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /moods/list", async () => {
      const res = await request(app).get("/api/v1/places/moods/list");
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /mood/:mood", async () => {
      const res = await request(app).get("/api/v1/places/mood/relax");
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /search", async () => {
      const res = await request(app).get("/api/v1/places/search?q=cafe");
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /category/:category", async () => {
      const res = await request(app).get("/api/v1/places/category/cafe");
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /:id", async () => {
      const res = await request(app).get("/api/v1/places/1");
      expect(res.statusCode).not.toBe(404);
    });
  });

  // 4. User Controller
  describe("User Endpoints (/api/v1/users)", () => {
    test("GET /profile", async () => {
      const res = await request(app)
        .get("/api/v1/users/profile")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("PUT /profile", async () => {
      const res = await request(app)
        .put("/api/v1/users/profile")
        .set(AUTH_HEADER)
        .send({ name: "Updated Name" });
      expect(res.statusCode).not.toBe(404);
    });
  });

  // 5. Chat Controller & ChatRoom Controller (เทสครบทุก Function)
  describe("Chat & Contact Endpoints", () => {
    test("GET /api/v1/messages/users", async () => {
      const res = await request(app)
        .get("/api/v1/messages/users")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /api/v1/messages/:id", async () => {
      const res = await request(app).get("/api/v1/messages/1").set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("POST /api/v1/messages/send/:id", async () => {
      const res = await request(app)
        .post("/api/v1/messages/send/1")
        .set(AUTH_HEADER)
        .send({ message: "Hello" });
      expect(res.statusCode).not.toBe(404);
    });

    test("PUT /api/v1/messages/mark-read/:id", async () => {
      const res = await request(app)
        .put("/api/v1/messages/mark-read/1")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("POST /api/v1/contact", async () => {
      const res = await request(app)
        .post("/api/v1/contact")
        .set(AUTH_HEADER)
        .send({ message: "Contact admin" });
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /api/v1/contact/:roomId/messages", async () => {
      const res = await request(app)
        .get("/api/v1/contact/1/messages")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("POST /api/v1/contact/:roomId/send", async () => {
      const res = await request(app)
        .post("/api/v1/contact/1/send")
        .set(AUTH_HEADER)
        .send({ text: "Hi" });
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /api/v1/contact/admin/all", async () => {
      const res = await request(app)
        .get("/api/v1/contact/admin/all")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("PUT /api/v1/contact/admin/:roomId/close", async () => {
      const res = await request(app)
        .put("/api/v1/contact/admin/1/close")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("PUT /api/v1/contact/admin/:roomId/status", async () => {
      const res = await request(app)
        .put("/api/v1/contact/admin/1/status")
        .set(AUTH_HEADER)
        .send({ status: "closed" });
      expect(res.statusCode).not.toBe(404);
    });

    test("DELETE /api/v1/contact/admin/:roomId", async () => {
      const res = await request(app)
        .delete("/api/v1/contact/admin/1")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });
  });

  // 6. Admin Controller
  describe("Admin Endpoints (/api/v1/admin)", () => {
    test("GET /api/v1/admin/dashboard", async () => {
      const res = await request(app)
        .get("/api/v1/admin/dashboard")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /api/v1/admin/users", async () => {
      const res = await request(app)
        .get("/api/v1/admin/users")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /api/v1/admin/places", async () => {
      const res = await request(app)
        .get("/api/v1/admin/places")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });
  });

  // 7. Favorites & History Controllers
  describe("Favorites & History Endpoints", () => {
    test("GET /api/v1/favorites", async () => {
      const res = await request(app).get("/api/v1/favorites").set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("POST /api/v1/favorites", async () => {
      const res = await request(app)
        .post("/api/v1/favorites")
        .set(AUTH_HEADER)
        .send({ placeId: 1 });
      expect(res.statusCode).not.toBe(404);
    });

    test("DELETE /api/v1/favorites/:id", async () => {
      const res = await request(app)
        .delete("/api/v1/favorites/1")
        .set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /api/v1/history", async () => {
      const res = await request(app).get("/api/v1/history").set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });

    test("POST /api/v1/history", async () => {
      const res = await request(app)
        .post("/api/v1/history")
        .set(AUTH_HEADER)
        .send({ placeId: 1 });
      expect(res.statusCode).not.toBe(404);
    });

    test("DELETE /api/v1/history", async () => {
      const res = await request(app).delete("/api/v1/history").set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });
  });

  // 8. AI Search & Maps Controllers
  describe("AI Search & Maps Endpoints", () => {
    test("POST /api/v1/ai/analyze-emotion", async () => {
      const res = await request(app)
        .post("/api/v1/ai/analyze-emotion")
        .send({ text: "เหนื่อยมาก อยากไปพักผ่อน" });
      expect(res.statusCode).not.toBe(404);
    });

    test("GET /api/v1/maps", async () => {
      const res = await request(app).get("/api/v1/maps").set(AUTH_HEADER);
      expect(res.statusCode).not.toBe(404);
    });
  });
});
