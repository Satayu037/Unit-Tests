// นำเข้าฟังก์ชันจาก utils/email.js (ปรับ path ให้ตรงกับชื่อไฟล์จริงของคุณ เช่น ./email หรือ ./email.js)
const { sendVerificationEmail, sendPasswordResetEmail } = require('./email');

// จำลอง (Mock) การทำงานของ fetch เพื่อไม่ให้ส่งอีเมลออกไปจริงๆ ตอนรันเทส
global.fetch = jest.fn();

describe('Testing Email Utilities', () => {
  const originalEnv = process.env;

  // ทำงานก่อนเริ่มรันแต่ละเทสเคส
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, BREVO_API_KEY: 'mock-key-for-testing' };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // เทสเคสที่ 1: ถ้าไม่มี API Key ต้องได้ผลลัพธ์เป็น false
  test('1. ต้องคืนค่า false ถ้าไม่มี BREVO_API_KEY ใน .env', async () => {
    delete process.env.BREVO_API_KEY; // ลองลบ API key ออก
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await sendVerificationEmail('test@gmail.com', 'fake-token');

    expect(result).toBe(false); // คาดหวังว่าฟังก์ชันจะส่ง false กลับมา
    consoleSpy.mockRestore();
  });

  // เทสเคสที่ 2: ถ้าส่งอีเมลสำเร็จ Brevo ตอบกลับมาปกติ
  test('2. ต้องคืนค่า true เมื่อส่งอีเมลสำเร็จ', async () => {
    // จำลองให้ fetch ตอบกลับมาว่าส่งผ่าน (ok: true)
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messageId: '12345' }),
    });

    const result = await sendVerificationEmail('user@gmail.com', 'valid-token');

    expect(result).toBe(true); // คาดหวังว่าจะได้ true
  });
});