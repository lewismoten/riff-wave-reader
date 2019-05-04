import Reader from "../index.js";
import * as locale from "../en-us.js";

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
  describe("Invalid File", () => {
    it("handles missing file", done => {
      const fileName = "this file does not exist";
      const reader = new Reader(fileName);
      reader.readRiff().catch(e => {
        expect(e).toEqual(locale.errorOpeningFile);
        done();
      });
    });
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
    it("matches snapshot", () => {
      expect(format).toEqual({
        id: "fmt ",
        size: 16,
        type: 1,
        typeName: "PCM",
        channels: 1,
        sampleRate: 8000,
        byteRate: 8000,
        blockAlignment: 1,
        bitsPerSample: 8,
        sampleSize: 1,
        sampleCount: 4309
      });
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
    it("calculates sample size", () => {
      expect(format.sampleSize).toBe(1);
    });
    it("calculates sample count", () => {
      expect(format.sampleCount).toBe(4309);
    });
    it("has valid byte rate", () => {
      expect(format.byteRate).toBe(
        (format.sampleRate * format.channels * format.bitsPerSample) / 8
      );
    });
    it("can read block alignment", () => {
      expect(format.blockAlignment).toBe(1);
    });
    it("has valid block alignment", () => {
      expect(format.blockAlignment).toBe(
        (format.channels * format.bitsPerSample) / 8
      );
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
      expect(dataHeader.start).toBe(44);
    });
  });
});
