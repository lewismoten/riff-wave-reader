import {
  uint8
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
})
