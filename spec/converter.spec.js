import {
  uint8,
  uint16,
  int16
} from "../src/converter.js";

describe("converter", () => {
  describe("uint8", () => {
    it("converts min value", () => {
      expect(uint8([0x00], 0)).toBe(0);
    });
    it("converts max value", () => {
      expect(uint8([0xFF], 0)).toBe(255);
    });
    it("starts from specified position", () => {
      expect(uint8([0x00, 0x01, 0x02], 1)).toBe(1);
    });
  });
  describe("uint16", () => {
    it("converts min value", () => {
      expect(uint16([0x00, 0x00], 0)).toBe(0);
    });
    it("converts max value", () => {
      expect(uint16([0xFF, 0xFF], 0)).toBe(65535);
    });
    it("starts from specified position", () => {
      expect(uint16([0x00, 0x01, 0x02, 0x03], 1)).toBe(513);
    });
  });
  describe("int16", () => {
    it("converts from min hex value", () => {
      expect(int16([0x00, 0x00], 0)).toBe(0);
    });
    it("converts from max hex value", () => {
      expect(int16([0xFF, 0xFF], 0)).toBe(-1);
    });
    it("converts to min int16 value", () => {
      expect(int16([0x00, 0x80], 0)).toBe(-32768);
    });
    it("converts to max int16 value", () => {
      expect(int16([0xFF, 0x7F], 0)).toBe(32767);
    });
    it("starts from specified position", () => {
      expect(int16([0x00, 0x01, 0x02, 0x03], 1)).toBe(513);
    });
  });
})
