const { GoogleGenerativeAI } = require("@google/generative-ai");

// ตรวจสอบว่ามี API Key หรือไม่ (ใช้คีย์จาก process.env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

// คีย์เวิร์ดและเหตุผลสำหรับประมวลผลโลคอลกรณี API ขัดข้อง/ไม่มีคีย์
const fallbackMoodKeywords = {
  "มีความสุข": {
    keywords: ["สุข", "ดีใจ", "สนุก", "เฮฮา", "ยิ้ม", "หัวเราะ", "ปลื้ม", "happy", "joy", "ดี", "ชอบ", "รัก"],
    reason: "ดูเหมือนว่าคุณกำลังมีความสุขและเต็มไปด้วยพลังงานบวก! ลองไปรักษามวลความสุขนี้ไว้ที่นี่เลย"
  },
  "โกรธ": {
    keywords: ["โกรธ", "หงุดหงิด", "โมโห", "รำคาญ", "เกลียด", "ด่า", "angry", "mad", "ควย", "สัส"],
    reason: "หากคุณรู้สึกโกรธหรือหงุดหงิด ลองไประบายพลังงานลบออกที่สถานที่แนะนำเหล่านี้ดูนะ"
  },
  "เบื่อ": {
    keywords: ["เบื่อ", "เซ็ง", "ว่าง", "เหงา", "เซง", "bored", "lonely"],
    reason: "ถ้าคุณกำลังรู้สึกเบื่อๆ เซ็งๆ ลองออกไปหาอะไรสนุกๆ ทำในสถานที่เหล่านี้เพื่อชาร์จพลังกัน"
  },
  "เศร้า": {
    keywords: ["เศร้า", "เสียใจ", "ร้องไห้", "ผิดหวัง", "ท้อ", "ร้อง", "sad", "cry"],
    reason: "ในวันที่รู้สึกเศร้าหรือเสียใจ ลองไปพักผ่อนใจในสถานที่สงบๆ ที่เราเลือกสรรมาให้คุณนะ"
  },
  "เครียด": {
    keywords: ["เครียด", "กดดัน", "หนักใจ", "วิตก", "กังวล", "ปวดหัว", "เหนื่อย", "ล้า", "นอนไม่หลับ", "ปวดท้อง", "ปวดหลัง", "stress", "stressed"],
    reason: "ร่างกายหรือจิตใจของคุณอาจกำลังเหนื่อยล้าสะสม ลองไปผ่อนคลายสมองในสถานที่แนะนำเหล่านี้ดูสิ"
  }
};

function localAnalyzeEmotion(text) {
  if (!text) return { emotion: "เครียด", reason: "กรุณาระบุข้อความบอกเล่าความรู้สึก" };
  
  const textLower = text.toLowerCase();
  
  // ค้นหาคำที่ตรงกับความรู้สึก
  for (const [emotion, data] of Object.entries(fallbackMoodKeywords)) {
    for (const keyword of data.keywords) {
      if (textLower.includes(keyword)) {
        return { emotion, reason: data.reason };
      }
    }
  }
  
  // หากไม่ตรงกับคีย์เวิร์ดใดๆ เลย ให้สุ่มอารมณ์เพื่อให้ผลลัพธ์ไม่ซ้ำซากจำเจ
  const emotions = Object.keys(fallbackMoodKeywords);
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  return {
    emotion: randomEmotion,
    reason: `ระบบแนะนำสถานที่สำหรับอารมณ์ "${randomEmotion}" เพื่อช่วยปรับอารมณ์ของคุณให้ดียิ่งขึ้น`
  };
}

exports.analyzeEmotion = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "กรุณาส่งข้อความมาวิเคราะห์" });
    }

    // ตรวจสอบเบื้องต้นว่ามีคีย์หรือไม่ ถ้าไม่มีให้โยน error เพื่อเข้าสู่ระบบประมวลผลแบบโลคอลทันที
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    // 🌟 1. ใช้โมเดล gemini-1.5-flash (รองรับเวอร์ชัน 0.24.1 ได้เสถียรที่สุดและเร็วกว่า)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 🌟 2. ใช้ Prompt ตามที่ผู้ใช้ต้องการ — บังคับให้ AI ตอบเป็น JSON เท่านั้น
    const prompt = `
คุณคือ AI ผู้เชี่ยวชาญด้านจิตวิทยาและการวิเคราะห์ความรู้สึก หน้าที่ของคุณคือการอ่านข้อความแชทจากผู้ใช้งาน และจัดหมวดหมู่ข้อความนั้นให้อยู่ใน "อารมณ์ 5 ประเภท" อย่างใดอย่างหนึ่งเท่านั้น

อารมณ์ทั้ง 5 ประเภท ได้แก่:
1. "มีความสุข" (Happy) - พลังงานบวก, อารมณ์ดี, ตื่นเต้น
2. "โกรธ" (Angry) - หงุดหงิด, ไม่พอใจ, หัวเสีย
3. "เบื่อ" (Bored) - เซ็ง, ว่างเปล่า, ขาดแรงจูงใจ
4. "เศร้า" (Sad) - หดหู่, เสียใจ, โดดเดี่ยว
5. "เครียด" (Stressed) - วิตกกังวล, กดดัน, เหนื่อยล้า, รวมถึง "อาการทางร่างกาย" ที่มักเกิดจากความเครียด เช่น ปวดหัว, ปวดท้อง, นอนไม่หลับ

กฎเหล็กสำหรับการประมวลผล:
1) หากผู้ใช้พิมพ์อาการทางกาย (เช่น ปวดท้อง, ปวดหลัง) โดยไม่มีบริบทอื่น ให้ตีความว่าร่างกายกำลังประท้วงจากความ "เครียด" หรือความเหนื่อยล้าสะสม
2) ห้ามตอบเป็นประโยคสนทนาทั่วไปเด็ดขาด
3) ให้ตอบกลับมาเป็นรูปแบบโครงสร้าง JSON เท่านั้น (ไม่มีข้อความอื่นใด)

รูปแบบ JSON ที่ต้องการให้ตอบกลับ:
{
  "emotion": "อารมณ์ที่วิเคราะห์ได้ (เลือกคำใดคำหนึ่ง: มีความสุข, โกรธ, เบื่อ, เศร้า, เครียด)",
  "reason": "คำอธิบายสั้นๆ ว่าทำไมถึงเป็นอารมณ์นี้ (เพื่อเอาไปแสดงเป็นข้อความปลอบใจให้ผู้ใช้)"
}

ตัวอย่างการทำงาน:
Input: "ปวดท้องจังเลย"
Output: { "emotion": "เครียด", "reason": "อาการปวดท้องมักเป็นสัญญาณเตือนของร่างกายเมื่อมีความเครียดสะสมหรือพักผ่อนไม่เพียงพอ" }

Input: "วันนี้สอบผ่านแล้วโว้ยยย"
Output: { "emotion": "มีความสุข", "reason": "คุณกำลังรู้สึกยินดีและมีพลังงานบวกจากความสำเร็จ" }

จงวิเคราะห์ข้อความต่อไปนี้: "${text}"

ตอบกลับมาเป็น JSON ตามโครงสร้างด้านบนเท่านั้น (ห้ามมีคำอธิบายหรือข้อความเพิ่มเติม)
    `;

    // สั่งให้ AI ประมวลผล
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 🌟 3. ล้างขยะ: ลบเครื่องหมาย ```json และ ``` ที่ AI มักจะชอบใส่มาเกิน (ตัวการที่ทำให้เกิด Error 500)
    let cleanText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // ค้นหาขอบเขตโครงสร้าง JSON Object เพื่อป้องกันข้อผิดพลาดกรณี AI พ่นข้อความอื่นมารอบๆ
    const startIdx = cleanText.indexOf("{");
    const endIdx = cleanText.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1) {
      cleanText = cleanText.substring(startIdx, endIdx + 1);
    }

    // แปลงข้อความที่ทำความสะอาดแล้วให้กลายเป็น JSON Object
    const parsedData = JSON.parse(cleanText);

    // ปรับรูปแบบอารมณ์ให้อยู่ในมาตรฐานระบบหลังบ้าน (สุข -> มีความสุข)
    // เพื่อให้ระบบนำค่าไปดึงข้อมูลสถานที่ตาม mood ใน database ได้ถูกต้อง
    let finalEmotion = parsedData.emotion
      ? parsedData.emotion.trim()
      : "เครียด";
    if (finalEmotion === "สุข" || finalEmotion === "มีความสุข") {
      finalEmotion = "มีความสุข";
    }

    // ส่งข้อมูลกลับไปให้ Frontend
    res.status(200).json({
      emotion: finalEmotion,
      reason:
        parsedData.reason || "เราเข้าใจคุณนะ ลองไปผ่อนคลายในสถานที่แนะนำดูสิ",
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    
    // ดึงข้อความส่งวิเคราะห์โลคอลเป็นระบบสำรอง (Local Fallback)
    const { text } = req.body;
    const localResult = localAnalyzeEmotion(text);

    // พ่นผลลัพธ์วิเคราะห์เบื้องต้นจากโลคอลกลับไป
    res.status(200).json({
      emotion: localResult.emotion,
      reason: localResult.reason,
      isFallback: true // แจ้ง frontend อ้อมๆ ว่าเป็นการวิเคราะห์สำรอง
    });
  }
};
