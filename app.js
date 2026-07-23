// 📄 app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import app จาก lib/socket (เพราะ socket ของคุณสร้าง app ไว้ในนั้น)
const { app } = require("./lib/socket");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const placeRoutes = require("./routes/placeRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const historyRoutes = require("./routes/historyRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");
const aiSearchRoutes = require("./routes/aiSearchRoutes");
const mapsRoutes = require("./routes/mapsRoutes");

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:5173",
      "https://moodlocationproject.vercel.app",
      "https://moodloca.vercel.app",
    ];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.error("CORS Error: Origin not allowed:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (สำหรับรูปภาพที่ upload)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========== Routes (v1) ==========
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/places", placeRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/history", historyRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/messages", chatRoutes);
app.use("/api/v1/contact", chatRoomRoutes);
app.use("/api/v1/ai", aiSearchRoutes);
app.use("/api/v1/maps", mapsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "🎭 เซิฟเวอณ์ของหลังบ้านทำงานแล้ว!",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "ไฟล์รูปต้องไม่เกิน 2MB",
      detail: `ไฟล์ของคุณมีขนาดเกินกำหนด กรุณาลองย่อรูปก่อน`,
    });
  }

  if (err.message && err.message.includes("อนุญาตเฉพาะไฟล์รูปภาพ")) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "ไม่พบ API endpoint ที่ร้องขอ" });
});

// ✅ Export เฉพาะตัว app ออกไปให้ไฟล์อื่นใช้งาน
module.exports = app;
