# 🚀 Backend Web Service & RESTful API with Comprehensive Unit Testing

ระบบ Backend RESTful API สำหรับบริการค้นหาด้วย AI, ระบบแชทเรียลไทม์ (Socket.io), จัดการสถานที่ (Places & Maps), ระบบสมาชิก (Authentication & User Management), ระบบรายการโปรด (Favorites) และประวัติการค้นหา (History) พร้อมชุดการทดสอบระบบ (Unit Testing & Integration Testing) และรายงาน Code Coverage แบบสมบูรณ์

---

## 📋 สารบัญ (Table of Contents)

- [ภาพรวมของโปรเจกต์ (Overview)](#-ภาพรวมของโปรเจกต์-overview)
- [ฟีเจอร์หลัก (Key Features)](#-ฟีเจอร์หลัก-key-features)
- [เทคโนโลยีที่ใช้ (Tech Stack)](#-เทคโนโลยีที่ใช้-tech-stack)
- [โครงสร้างไดเรกทอรี (Directory Structure)](#-โครงสร้างไดเรกทอรี-directory-structure)
- [การตั้งค่าสภาพแวดล้อม (Environment Variables)](#-การตั้งค่าสภาพแวดล้อม-environment-variables)
- [ขั้นตอนการติดตั้งและการใช้งาน (Installation & Running)](#-ขั้นตอนการติดตั้งและการใช้งาน-installation--running)
  - [การรันบน Local Environment](#1-การรันบน-local-environment)
  - [การรันด้วย Docker & Docker Compose](#2-การรันด้วย-docker--docker-compose)
  - [การรันโปรดักชันด้วย PM2](#3-การรันโปรดักชันด้วย-pm2)
- [การทดสอบและการรายงานผล (Testing & Coverage)](#-การทดสอบและการรายงานผล-testing--coverage)
- [รายการ API Endpoints (API Routes Overview)](#-รายการ-api-endpoints-api-routes-overview)
- [สถาปัตยกรรมและการทำงาน (Architecture)](#-สถาปัตยกรรมและการทำงาน-architecture)

---

## 🌟 ภาพรวมของโปรเจกต์ (Overview)

โปรเจกต์นี้เป็นระบบ **Node.js Express Backend** ที่ถูกออกแบบตามหลักสถาปัตยกรรม **MVC (Model-View-Controller)** เน้นความสะอาดของโค้ด (Clean Code) มีความปลอดภัย และครอบคลุมด้วยการเขียน **Unit Tests** สำหรับ Controller, Route และ Utility ทั้งหมด เพื่อให้มั่นใจในเสถียรภาพและคุณภาพของระบบก่อนนำไป Deployment

---

## 🔑 ฟีเจอร์หลัก (Key Features)

1. **ระบบพิสูจน์ตัวตนและผู้ใช้งาน (Authentication & User Management)**
   - สมัครสมาชิก, ลงชื่อเข้าใช้ (JWT Authentication)
   - การยืนยันอีเมลและการรีเซ็ตรหัสผ่านผ่านระบบ Utility Email
   - การอัปโหลดภาพโปรไฟล์ผ่าน Supabase Storage / File Middleware
2. **ระบบค้นหาด้วย AI (AI Search Engine Integration)**
   - API สำหรับรับคำค้นหา วิเคราะห์ และส่งผลลัพธ์คำตอบผ่าน AI Controller
3. **ระบบแชทเรียลไทม์ (Real-time Chat System)**
   - รองรับห้องแชท (Chat Rooms) และการส่งข้อความแชท (Chat Messages)
   - เชื่อมต่อผ่าน **Socket.io** เพื่ออัปเดตข้อมูลแบบทันที
4. **ระบบแผนที่และสถานที่ (Maps & Places Management)**
   - ค้นหา ดึงข้อมูล และจัดการสถานที่ (Places)
   - เชื่อมต่อ API แผนที่สำหรับการคำนวณพิกัดและตำแหน่งสถานที่
5. **ระบบรายการโปรดและประวัติการใช้งาน (Favorites & History)**
   - บันทึก/ลบสถานที่โปรดของผู้ใช้งาน
   - บันทึกประวัติการค้นหาและเข้าชม
6. **ระบบจัดการสำหรับผู้ดูแลระบบ (Admin Panel System)**
   - API สิทธิ์ Admin สำหรับจัดการผู้ใช้งาน สถานที่ และตรวจสอบสถิติระบบ

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

- **Runtime Environment:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB / PostgreSQL (ผ่าน Mongoose หรือ ORM/ODM ที่เกี่ยวข้อง)
- **Object Storage:** Supabase Storage (สำหรับจัดเก็บไฟล์สื่อ/รูปภาพ)
- **Real-time Protocol:** Socket.io
- **Testing Framework:** Jest, Supertest
- **Containerization & Deployment:** Docker, Docker Compose, PM2
- **Utilities:** JSON Web Token (JWT), bcrypt, Nodemailer

---

## 📁 โครงสร้างไดเรกทอรี (Directory Structure)

```text
Unit-Tests-main/
├── config/                  # ไฟล์กำหนดค่าฐานข้อมูลและบริการภายนอก
│   ├── db.js                # เชื่อมต่อ Database Main
│   └── supabase.js          # เชื่อมต่อ Supabase Client (Storage/Auth)
├── controllers/             # ลอจิกการทำงานหลัก (Controllers) และ Unit Tests
│   ├── adminController.js
│   ├── adminController.test.js
│   ├── aiSearchController.js
│   ├── aiSearchController.test.js
│   ├── authController.js
│   ├── authController.test.js
│   ├── chatController.js
│   ├── chatController.test.js
│   ├── chatRoomController.js
│   ├── chatRoomController.test.js
│   ├── favoriteController.js
│   ├── favoriteController.test.js
│   ├── historyController.js
│   ├── historyController.test.js
│   ├── mapsController.js
│   ├── mapsController.test.js
│   ├── placeController.js
│   ├── placeController.test.js
│   ├── userController.js
│   └── userController.test.js
├── coverage/                # รายงานผลการรัน Test Coverage (Lcov, HTML, JSON)
│   ├── lcov-report/         # รายงานเว็บ HTML สำหรับดูการครอบคลุมของเทส
│   ├── clover.xml
│   └── coverage-final.json
├── lib/                     # ไลบรารีส่วนกลาง
│   └── socket.js            # กำหนดค่าและการเชื่อมต่อ Socket.io
├── middleware/              # ตัวคัดกรองคำขอ (Middleware)
│   ├── authMiddleware.js    # ตรวจสอบ JWT Token & Permission
│   └── uploadMiddleware.js  # จัดการการอัปโหลดไฟล์ (Multer/Storage)
├── models/                  # โครงสร้างโมเดลข้อมูล (Database Schemas)
│   ├── ChatMessage.js
│   ├── ChatRoom.js
│   ├── Favorite.js
│   ├── History.js
│   ├── Place.js
│   ├── User.js
│   └── index.js
├── routes/                  # กำหนดเส้นทาง API (Routes) และ Integration Tests
│   ├── adminRoutes.js
│   ├── adminRoutes.test.js
│   ├── aiSearchRoutes.js
│   ├── aiSearchRoutes.test.js
│   ├── authRoutes.js
│   ├── authRoutes.test.js
│   ├── chatRoomRoutes.js
│   ├── chatRoomRoutes.test.js
│   ├── chatRoutes.js
│   ├── chatRoutes.test.js
│   ├── favoriteRoutes.js
│   ├── favoriteRoutes.test.js
│   ├── historyRoutes.js
│   ├── historyRoutes.test.js
│   ├── mapsRoutes.js
│   ├── mapsRoutes.test.js
│   ├── placeRoutes.js
│   ├── placeRoutes.test.js
│   ├── userRoutes.js
│   └── userRoutes.test.js
├── utils/                   # ฟังก์ชันช่วยทำงานย่อย
│   ├── email.js             # ส่งอีเมล (Nodemailer/SMTP)
│   └── email.test.js
├── app.js                   # การตั้งค่า Express Application หลัก
├── app.test.js              # Integration test สำหรับแอปหลัก
├── server.js                # Entry point ในการสั่งรัน Server
├── Dockerfile               # สคริปต์สำหรับการสร้าง Docker Image
├── docker-compose.yml       # ไฟล์ตั้งค่า Docker Container Service
├── ecosystem.config.js      # ไฟล์ตั้งค่ากระบวนการทำงานสำหรับ PM2
├── package.json             # รายการ Dependencies และ Scripts
└── .gitignore / .dockerignore
```

---

## ⚙️ การตั้งค่าสภาพแวดล้อม (Environment Variables)

สร้างไฟล์ `.env` ไว้ที่ Root Directory ของโปรเจกต์ โดยกำหนดค่าดังต่อไปนี้:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/unittest_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Supabase Configuration (สำหรับรูปภาพและไฟล์)
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_key

# Email Config (สำหรับยิงแจ้งเตือน/รีเซ็ตรหัสผ่าน)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Google Maps / Location API Key
MAPS_API_KEY=your_google_maps_api_key

# AI Search API Key
AI_SEARCH_API_KEY=your_ai_service_api_key
```

---

## 📦 ขั้นตอนการติดตั้งและการใช้งาน (Installation & Running)

### 1. การรันบน Local Environment

```bash
# 1. โคลนคลังโค้ดและเข้าไปที่ไดเรกทอรี
git clone <repository-url>
cd Unit-Tests-main

# 2. ติดตั้ง Dependencies ทั้งหมด
npm install

# 3. รันเซิร์ฟเวอร์ในโหมดพัฒนา (Development Mode)
npm run dev

# 4. รันเซิร์ฟเวอร์ในโหมดปกติ (Production Mode)
npm start
```

### 2. การรันด้วย Docker & Docker Compose

```bash
# สร้าง Image และเปิดสั่งรัน Container ใน background
docker-compose up -d --build

# ดู Logs การทำงานของ Container
docker-compose logs -f

# สั่งหยุดการทำงาน Container
docker-compose down
```

### 3. การรันโปรดักชันด้วย PM2

```bash
# ติดตั้ง PM2 แบบ Global (ถ้ายังไม่มี)
npm install -g pm2

# สั่งรันแอปพลิเคชันผ่าน ecosystem.config.js
pm2 start ecosystem.config.js

# ดูสถานะกระบวนการรัน
pm2 status
```

---

## 🧪 การทดสอบและการรายงานผล (Testing & Coverage)

โปรเจกต์นี้เขียนการทดสอบครอบคลุมทั้ง Controller, Route, Utils และ App ด้วย **Jest** และ **Supertest**

### คำสั่งรันการทดสอบ:

```bash
# 1. รันการทดสอบ Unit Tests ทั้งหมด
npm test

# 2. รันการทดสอบพร้อมสร้างรายงาน Code Coverage
npm run test:coverage

# 3. รันการทดสอบในโหมดเฝ้าระวังการเปลี่ยนแปลงโค้ด (Watch Mode)
npm run test:watch
```

### การดูรายงานผล Code Coverage:
เมื่อสั่งรัน `npm run test:coverage` ระบบจะสร้างโฟลเดอร์ `coverage/` ขึ้นมา คุณสามารถเปิดไฟล์รายงานผ่านเบราว์เซอร์ได้ที่:
```text
coverage/lcov-report/index.html
```

---

## 📡 รายการ API Endpoints (API Routes Overview)

| การทำงาน (Module) | Method | Endpoint Path | คำอธิบาย (Description) | สิทธิ์เข้าถึง |
| :--- | :---: | :--- | :--- | :---: |
| **Auth** | `POST` | `/api/auth/register` | ลงทะเบียนผู้ใช้ใหม่ | Public |
| | `POST` | `/api/auth/login` | เข้าสู่ระบบ และรับ JWT Token | Public |
| | `POST` | `/api/auth/forgot-password` | ขอรีเซ็ตรหัสผ่านผ่านอีเมล | Public |
| **Users** | `GET` | `/api/users/profile` | ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน | User |
| | `PUT` | `/api/users/profile` | อัปเดตข้อมูลโปรไฟล์ / รูปภาพ | User |
| **AI Search** | `POST` | `/api/ai-search` | ค้นหาข้อมูลหรือประมวลผลคำถามด้วย AI | User |
| **Places** | `GET` | `/api/places` | ดึงรายการสถานที่ทั้งหมด / ค้นหาตามเงื่อนไข | Public |
| | `POST` | `/api/places` | เพิ่มสถานที่ใหม่ | Admin/User |
| | `GET` | `/api/places/:id` | ดึงรายละเอียดสถานที่ตาม ID | Public |
| **Maps** | `GET` | `/api/maps/search` | ค้นหาพิกัดและข้อมูลแผนที่ | User |
| **Favorites** | `GET` | `/api/favorites` | ดึงรายการสถานที่โปรดของผู้ใช้ | User |
| | `POST` | `/api/favorites` | เพิ่มสถานที่เข้าสู่รายการโปรด | User |
| | `DELETE`| `/api/favorites/:id` | ลบสถานที่ออกจากรายการโปรด | User |
| **History** | `GET` | `/api/history` | ดูประวัติการค้นหา/เข้าชม | User |
| | `DELETE`| `/api/history` | ลบประวัติการใช้งาน | User |
| **Chat & Rooms**| `GET` | `/api/chat-rooms` | รายการห้องแชทของผู้ใช้ | User |
| | `POST` | `/api/chat-rooms` | สร้างห้องแชทใหม่ | User |
| | `GET` | `/api/chat/messages/:roomId` | ดึงประวัติข้อความแชทในห้อง | User |
| **Admin** | `GET` | `/api/admin/users` | จัดการและดูรายชื่อผู้ใช้ทั้งหมด | Admin |
| | `DELETE`| `/api/admin/users/:id` | ลบผู้ใช้งานออกจากระบบ | Admin |

---

## 🏗 สถาปัตยกรรมและการทำงาน (Architecture)

1. **Request Flow:** `Client` ➔ `Routes` ➔ `Auth/Upload Middleware` ➔ `Controller` ➔ `Model/Service` ➔ `Database/External API`
2. **Real-time Event Flow:** `Socket Client` ➔ `lib/socket.js` ➔ `Chat Controller / Event Listener` ➔ Broadcast ถึงสมาชิกในห้อง
3. **Automated Testing Strategy:**
   - **Unit Tests:** ทดสอบเฉพาะฟังก์ชันใน `controllers/*.test.js` และ `utils/*.test.js` โดยทำ Mock Dependencies
   - **Integration Tests:** ทดสอบ End-to-End API ผ่าน `routes/*.test.js` และ `app.test.js` ด้วย Supertest
```
eof