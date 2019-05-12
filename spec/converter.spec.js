import {
  uint8,
  uint16,
  int16,
  uint32,
  ascii
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
  describe("uint32", () => {
    it("converts to min value", () => {
      expect(uint32([0x00, 0x00, 0x00, 0x00], 0)).toBe(0);
    });
    it("converts to max value", () => {
      expect(uint32([0xff, 0xff, 0xff, 0xff], 0)).toBe(4294967295);
    });
    it("starts from specified position", () => {
      expect(uint32([0x00, 0x01, 0x02, 0x03, 0x04, 0x05], 1)).toBe(67305985);
    });
  });
  describe("ascii", () => {
    const hello = [0x48, 0x65, 0x6C, 0x6C, 0x6F];
    it("reads chars", () => {
      expect(ascii(hello, 0, 5)).toBe("Hello");
    });
    it("starts from specified position", () => {
      expect(ascii(hello, 1, 3)).toBe("ell");
    });
    it("can read null", () => {
      expect(ascii([0x48, 0x00, 0x48], 0, 3)).toBe("\x48\x00\x48");
    });
    it("can not read unicode (R)", () => {
      expect(ascii([0xc2, 0xae], 0, 2)).not.toBe("\uc2ae");
    });
    it("can read ascii (R)", () => {
      expect(ascii([0xae], 0, 1)).toBe("®");
    });
  });
})
