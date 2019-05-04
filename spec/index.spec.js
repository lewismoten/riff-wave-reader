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
    it("matches snapshot", () => {
      expect(riff).toEqual({
        tag: "RIFF",
        size: 4309,
        format: "WAVE"
      });
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
    const id = "fmt ";
    const size = 16;
    const type = 1;
    const typeName = "PCM";
    const channels = 1;
    const sampleRate = 8000;
    const byteRate = 8000;
    const blockAlignment = 1;
    const bitsPerSample = 8;
    const sampleSize = 1;
    const sampleCount = 4265;
    const duration = 0.533125;
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
        id,
        size,
        type,
        typeName,
        channels,
        sampleRate,
        byteRate,
        blockAlignment,
        bitsPerSample,
        sampleSize,
        sampleCount,
        duration
      });
    });
    it("can read id", () => {
      expect(format.id).toBe(id);
    });
    it("can read size", () => {
      expect(format.size).toBe(size);
    });
    it("can read type", () => {
      expect(format.type).toBe(type);
    });
    it("can read typeName", () => {
      expect(format.typeName).toBe(typeName);
    });
    it("can read channels", () => {
      expect(format.channels).toBe(channels);
    });
    it("can read sample rate", () => {
      expect(format.sampleRate).toBe(sampleRate);
    });
    it("can read byte rate", () => {
      expect(format.byteRate).toBe(byteRate);
    });
    it("calculates sample size", () => {
      expect(format.sampleSize).toBe(sampleSize);
    });
    it("calculates sample count", () => {
      expect(format.sampleCount).toBe(sampleCount);
    });
    it("calculates duration in fractional seconds", () => {
      expect(format.duration).toBe(duration);
    });
    it("has valid byte rate", () => {
      expect(format.byteRate).toBe((sampleRate * channels * bitsPerSample) / 8);
    });
    it("can read block alignment", () => {
      expect(format.blockAlignment).toBe(blockAlignment);
    });
    it("has valid block alignment", () => {
      expect(format.blockAlignment).toBe((channels * bitsPerSample) / 8);
    });
    it("can read bits per sample", () => {
      expect(format.bitsPerSample).toBe(bitsPerSample);
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
  describe("Sample", () => {
    const channel = 0;
    it("can read first sample", done => {
      const reader = new Reader(file);
      reader
        .readSample(channel, 0)
        .then(sample => {
          expect(sample).toBe(0x7f);
        })
        .then(done);
    });
    it("can read second sample", done => {
      const reader = new Reader(file);
      reader
        .readSample(channel, 1)
        .then(sample => {
          expect(sample).toBe(0x80);
        })
        .then(done);
    });
    it("can read last sample", done => {
      const reader = new Reader(file);
      // 81 81 81 81 80 80 80 7F [7F] 7E 7E 7E 7E 7E 7E 7E 7E .. .. ..
      reader.readFormat().then(({ sampleCount }) => {
        reader
          .readSample(channel, sampleCount - 1)
          .then(sample => {
            expect(sample).toBe(0x7f);
          })
          .then(done);
      });
    });
    it("can read penultimate sample", done => {
      const reader = new Reader(file);
      // 81 81 81 81 80 80 80 [7F] 7F 7E 7E 7E 7E 7E 7E 7E 7E .. .. ..
      reader.readFormat().then(({ sampleCount }) => {
        reader
          .readSample(channel, sampleCount - 2)
          .then(sample => {
            expect(sample).toBe(0x7f);
          })
          .then(done);
      });
    });
  });
});
