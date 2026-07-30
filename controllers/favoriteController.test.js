const { toggleFavorite } = require('./favoriteController');
const { Favorite } = require('../models');

// Mock Sequelize Model
jest.mock('../models', () => ({
  Favorite: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(), // เพิ่ม mock สำหรับ destroy ระดับ Model
  },
}));

describe('Testing Favorite Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: 1 },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('1. ต้องกดเลิกชอบ (Remove) ได้ ถ้ามีรายการนี้ในระบบอยู่แล้ว', async () => {
    // กำหนด req.body ให้ครอบคลุมทุกชื่อฟิลด์ที่ Controller อาจจะใช้
    req.body = { 
      placeId: 'p001', 
      place_id: 'p001', 
      name: 'คาเฟ่แมว', 
      placeName: 'คาเฟ่แมว', 
      image: 'cat.jpg', 
      placeImage: 'cat.jpg' 
    };

    const mockFavorite = { 
      id: 1, 
      destroy: jest.fn().mockResolvedValue(true) 
    };
    Favorite.findOne.mockResolvedValue(mockFavorite);
    Favorite.destroy.mockResolvedValue(1);

    await toggleFavorite(req, res);

    // เช็คว่ามีการสั่งลบ (ผ่าน mockFavorite.destroy หรือ Favorite.destroy อย่างใดอย่างหนึ่ง)
    const isDestroyCalled = mockFavorite.destroy.mock.calls.length > 0 || Favorite.destroy.mock.calls.length > 0;
    expect(isDestroyCalled).toBe(true);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('2. ต้องกดเพิ่มรายการโปรด (Add) ได้ ถ้ายังไม่มีในระบบ', async () => {
    req.body = { 
      placeId: 'p001', 
      place_id: 'p001', 
      name: 'คาเฟ่แมว', 
      placeName: 'คาเฟ่แมว', 
      image: 'cat.jpg', 
      placeImage: 'cat.jpg' 
    };

    Favorite.findOne.mockResolvedValue(null);
    Favorite.create.mockResolvedValue({ id: 1, placeId: 'p001' });

    await toggleFavorite(req, res);

    expect(Favorite.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});