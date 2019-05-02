import Reader from "../index.js";
import path from "path";

const file = path.join(__dirname, "../samples/hello.wav");

describe("riff-wave-reader", () => {
  it("is function", () => {
    expect(typeof Reader).toBe("function");
  });
  it("can instantiate", () => {
    const reader = new Reader();
    expect(typeof reader).toBe("object");
  });
  describe("RIFF Chunk", () => {
    let reader;
    let riff;
    beforeAll(done => {
      reader = new Reader(file);
      reader
        .readRiff()
        .then(result => {
          riff = result;
        })
        .then(done);
    });
    it("can read tag", () => {
      expect(riff.tag).toBe("RIFF");
    });
    it("can read size", () => {
      expect(riff.size).toBe(4309);
    });
    it("can read format", () => {
      expect(riff.format).toBe("WAVE");
    });
  });
  describe("Format Chunk", () => {
    let reader;
    let format;
    beforeAll(done => {
      reader = new Reader(file);
      reader
        .readFormat()
        .then(result => {
          format = result;
        })
        .then(done);
    });
    it("can read id", () => {
      expect(format.id).toBe("fmt ");
    });
    it("can read id", () => {
      // PCM is 16
      expect(format.size).toBe(16);
    });
  });
});
