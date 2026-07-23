// 📄 server.js
require("dotenv").config();

const { connectDB } = require("./config/db");
const { sequelize } = require("./models");

// 1. ดึง app ที่เราเซ็ตค่า Route เรียบร้อยแล้วจาก app.js
const app = require("./app");

// 2. ดึง server (Socket.IO) มาเปิดใช้งาน
const { server } = require("./lib/socket");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // แก้ปัญหา Foreign Key
    try {
      await sequelize.query(
        'ALTER TABLE "favorites" DROP CONSTRAINT IF EXISTS "favorites_placeId_fkey" CASCADE;',
      );
      await sequelize.query(
        'ALTER TABLE "histories" DROP CONSTRAINT IF EXISTS "histories_placeId_fkey" CASCADE;',
      );
    } catch (e) {
      console.log("Constraint might not exist or already dropped");
    }

    // Sync database
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");

    // สั่งเปิด Server
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 http://localhost:${PORT}`);
      console.log(`📡 API: bound to 0.0.0.0:${PORT}`);
      console.log(`💬 Socket.IO: WebSocket ready for chat`);
    });
  } catch (error) {
    console.error("❌ ไม่สามรถเชื่อมต่อฐานข้อมูล PostgreSQL:", error);
    process.exit(1);
  }
};

startServer();
