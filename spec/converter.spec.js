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
    // second byte, first bit indicates signed state
    it("converts to min value", () => {
      expect(int16([0b00000000, 0b10000000], 0)).toBe(-32768);
    });
    it("converts to -2", () => {
      expect(int16([0b11111110, 0b11111111], 0)).toBe(-2);
    });
    it("converts from max value", () => {
      expect(int16([0b11111111, 0b11111111], 0)).toBe(-1);
    });
    it("converts from min value", () => {
      expect(int16([0b00000000, 0b00000000], 0)).toBe(0);
    });
    it("converts to 1", () => {
      expect(int16([0b00000001, 0b00000000], 0)).toBe(1);
    });
    it("starts from specified position", () => {
      expect(int16([0x00, 0x01, 0x02, 0x03], 1)).toBe(513);
    });
    it("converts to max value", () => {
      expect(int16([0b11111111, 0b01111111], 0)).toBe(32767);
    });
  });
})
