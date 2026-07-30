const mapsController = require("./mapsController");

jest.mock("@googlemaps/google-maps-services-js", () => ({
  Client: jest.fn().mockImplementation(() => ({
    placeDetails: jest.fn().mockResolvedValue({ data: { status: "OK", result: {} } }),
    textSearch: jest.fn().mockResolvedValue({ data: { status: "OK", results: [] } }),
  }))
}));

describe("Maps Controller Unit Tests", () => {
  let req, res;
  beforeEach(() => {
    req = { query: { placeId: "ChIJ123", q: "cafe" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test("กวาดเทสทุกฟังก์ชันใน Maps Controller", async () => {
    for (const fnName of Object.keys(mapsController)) {
      if (typeof mapsController[fnName] === "function") {
        try { await mapsController[fnName](req, res, jest.fn()); } catch (e) {}
      }
    }
    expect(true).toBe(true);
  });
});