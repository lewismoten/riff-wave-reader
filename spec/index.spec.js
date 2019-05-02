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
    it("can read size", () => {
      // PCM format takes up the next 16 bytes
      expect(format.size).toBe(16);
    });
    it("can read type", () => {
      expect(format.type).toBe(1);
    });
    it("can read typeName", () => {
      expect(format.typeName).toBe("PCM");
    });
    it("can read channels", () => {
      expect(format.channels).toBe(1);
    });
    it("can read sample rate", () => {
      expect(format.sampleRate).toBe(8000);
    });
    it("can read byte rate", () => {
      expect(format.byteRate).toBe(8000);
    });
    it("can read block alignment", () => {
      // 8 bit PCM = 1 byte
      // 1 channel * 1 byte = 1 byte per sample / block
      expect(format.blockAlignment).toBe(1);
    });
    it("can read bits per sample", () => {
      expect(format.bitsPerSample).toBe(8);
    });
  });
  describe("Data Chunk Header", () => {
    let reader;
    let dataHeader;
    beforeAll(done => {
      reader = new Reader(file);
      reader
        .readDataHeader()
        .then(result => {
          dataHeader = result;
        })
        .then(done);
    });
    it("can read id", () => {
      expect(dataHeader.id).toBe("data");
    });
    it("can read size", () => {
      expect(dataHeader.size).toBe(4273);
    });
    it("calculates start position", () => {
      // should be same as riff.size + 4
      expect(dataHeader.startPosition).toBe(44);
    });
  });
});
