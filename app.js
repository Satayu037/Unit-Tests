// 📄 app.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

// 1. ดึง Express app instance จาก lib/socket
const { app } = require("./lib/socket");

// ==========================================
// 2. Import Routes
// ==========================================
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

// ==========================================
// 3. CORS Configuration
// ==========================================
const defaultOrigins = [
  "http://localhost:5173",
  "https://moodlocationproject.vercel.app",
  "https://moodloca.vercel.app",
];

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : defaultOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    // อนุญาต request ที่ไม่มี origin (เช่น Mobile App, Postman, Same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.error(`❌ CORS Rejection: Domain "${origin}" ไม่ได้รับอนุญาต`);
    return callback(new Error("CORS_NOT_ALLOWED"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// ==========================================
// 4. Body Parsers & Static Files
// ==========================================
// เพิ่ม limit ขนาด Payload เพื่อป้องกัน Request ขนาดใหญ่เกินไปกดดัน Server
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ให้บริการ Static files สำหรับรูปภาพที่อัปโหลด
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================================
// 5. API Routes (v1)
// ==========================================
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

// ==========================================
// 6. Health Check Endpoint
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎭 เซิร์ฟเวอร์หลังบ้านทำงานปกติ!",
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 7. Global 404 Handler (สำหรับ Route ที่ไม่มีอยู่จริง)
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "ไม่พบ API endpoint ที่ร้องขอ",
    path: req.originalUrl,
  });
});

// ==========================================
// 8. Global Error Handling Middleware
// ==========================================
app.use((err, req, res, next) => {
  // 8.1 จัดการกรณีติด CORS Policy
  if (err.message === "CORS_NOT_ALLOWED") {
    return res.status(403).json({
      success: false,
      message: "ไม่อนุญาตให้เข้าถึงเนื่องจากติดนโยบาย CORS",
    });
  }

  // 8.2 จัดการ Error จาก Multer (ขนาดไฟล์เกิน 2MB)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "ไฟล์รูปต้องมีขนาดไม่เกิน 2MB",
      detail: "ไฟล์ของคุณมีขนาดเกินกำหนด กรุณาย่อขนาดรูปภาพก่อนอัปโหลดอีกครั้ง",
    });
  }

  // 8.3 จัดการ Error ประเภทไฟล์รูปภาพไม่ถูกต้อง
  if (err.message && err.message.includes("อนุญาตเฉพาะไฟล์รูปภาพ")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // 8.4 Log และตอบกลับกรณีเป็น Internal Server Error (500)
  console.error("🔥 Server Error Stack:", err);

  return res.status(500).json({
    success: false,
    message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});


module.exports = app;