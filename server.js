// 📄 server.js
require("dotenv").config();

const { connectDB } = require("./config/db");
const { sequelize } = require("./models");
const app = require("./app");
const { server } = require("./lib/socket");

const PORT = process.env.PORT || 5000;
const IS_DEV = process.env.NODE_ENV !== "production";

const startServer = async () => {
  try {
    // 1. เชื่อมต่อฐานข้อมูล
    await connectDB();

    // 2. จัดการ Database Schema (รันเฉพาะสภาพแวดล้อม Development เท่านั้น)
    if (IS_DEV) {
      try {
        await sequelize.query(
          'ALTER TABLE "favorites" DROP CONSTRAINT IF EXISTS "favorites_placeId_fkey" CASCADE;'
        );
        await sequelize.query(
          'ALTER TABLE "histories" DROP CONSTRAINT IF EXISTS "histories_placeId_fkey" CASCADE;'
        );
      } catch (e) {
        console.warn("⚠️ Constraint update skipped or already dropped");
      }

      await sequelize.sync({ alter: true });
      console.log("✅ [DEV] Database synced successfully");
    }

    // 3. สั่งเปิด Server
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📡 API Bound to: 0.0.0.0:${PORT}`);
      console.log(`💬 Socket.IO: WebSocket ready for chat`);
    });
  } catch (error) {
    console.error("❌ ไม่สามารถเชื่อมต่อฐานข้อมูล PostgreSQL:", error);
    process.exit(1);
  }
};

startServer();