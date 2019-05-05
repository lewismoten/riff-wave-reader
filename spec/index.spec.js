import RiffWaveReader from "../src/index.js";
import * as locale from "../src/en-us.js";
const fs = require("fs");
const util = require("util");

import path from "path";

const file = path.join(__dirname, "../samples/hello.wav");

describe("riff-wave-reader", () => {
  it("is function", () => {
    expect(typeof RiffWaveReader).toBe("function");
  });
  it("can instantiate", () => {
    const reader = new RiffWaveReader();
    expect(typeof reader).toBe("object");
  });
  describe("desciptors", () => {
    const descriptors = {
      riff: {
        tag: "RIFF",
        size: 4309,
        format: "WAVE"
      },
      format: {
        id: "fmt ",
        size: 16,
        type: 1,
        channels: 1,
        sampleRate: 8000,
        byteRate: 8000,
        blockAlignment: 1,
        bitsPerSample: 8,
        typeName: "PCM",
        sampleSize: 1,
        sampleStart: 44,
        sampleCount: 4265,
        duration: 0.533125
      },
      data: {
        id: "data",
        size: 4273,
        start: 44
      }
    };

    it("can read from file", done => {
      const reader = new RiffWaveReader(file);
      reader
        .readChunks()
        .then(chunks => {
          expect(chunks).toEqual(descriptors);
        })
        .then(done);
    });
    describe("Buffer", () => {
      let reader;
      beforeAll(done => {
        const read = util.promisify(fs.read);
        fs.open(file, "r", (openError, fileDescriptor) => {
          expect(openError).toBe(null);
          if (openError) throw openError;
          const myBuffer = Buffer.alloc(45);
          read(fileDescriptor, myBuffer, 0, 45, 0).then(({ buffer }) => {
            reader = new RiffWaveReader(buffer);
            done();
          });
        });
      });
      it("reads descriptors", done => {
        reader.readChunks().then(chunks => {
          expect(chunks).toEqual(descriptors);
          done();
        });
      });
      it("reads first channels first sample", done => {
        reader.readSample(0, 0).then(sample => {
          expect(sample).toBe(0x7f);
          done();
        });
      });
    });
    describe("Array", () => {
      let reader;
      beforeAll(done => {
        const read = util.promisify(fs.read);
        fs.open(file, "r", (openError, fileDescriptor) => {
          expect(openError).toBe(null);
          if (openError) throw openError;
          const myBuffer = Buffer.alloc(45);
          read(fileDescriptor, myBuffer, 0, 45, 0).then(({ buffer }) => {
            const array = [];
            array.push(...buffer);
            reader = new RiffWaveReader(array);
            done();
          });
        });
      });
      it("reads descriptors", done => {
        reader.readChunks().then(chunks => {
          expect(chunks).toEqual(descriptors);
          done();
        });
      });
      it("reads first channels first sample", done => {
        reader.readSample(0, 0).then(sample => {
          expect(sample).toBe(0x7f);
          done();
        });
      });
    });
  });
  describe("Invalid File", () => {
    it("handles missing file", done => {
      const fileName = "this file does not exist";
      const reader = new RiffWaveReader(fileName);
      reader.readChunks().catch(e => {
        expect(e).toEqual(locale.errorOpeningFile);
        done();
      });
    });
  });
  describe("RIFF Chunk", () => {
    let reader;
    let riff;
    beforeAll(done => {
      reader = new RiffWaveReader(file);
      reader
        .readChunks()
        .then(result => {
          riff = result.riff;
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
    const sampleStart = 44;
    beforeAll(done => {
      reader = new RiffWaveReader(file);
      reader
        .readChunks()
        .then(result => {
          format = result.format;
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
        duration,
        sampleStart
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
    it("calculates sample start", () => {
      expect(format.sampleStart).toBe(sampleStart);
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
      reader = new RiffWaveReader(file);
      reader
        .readChunks()
        .then(result => {
          dataHeader = result.data;
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
      const reader = new RiffWaveReader(file);
      reader
        .readSample(channel, 0)
        .then(sample => {
          expect(sample).toBe(0x7f);
        })
        .then(done);
    });
    it("can read second sample", done => {
      const reader = new RiffWaveReader(file);
      reader
        .readSample(channel, 1)
        .then(sample => {
          expect(sample).toBe(0x80);
        })
        .then(done);
    });
    it("can read last sample", done => {
      const reader = new RiffWaveReader(file);
      // 81 81 81 81 80 80 80 7F [7F] 7E 7E 7E 7E 7E 7E 7E 7E .. .. ..
      reader.readChunks().then(({ format }) => {
        reader
          .readSample(channel, format.sampleCount - 1)
          .then(sample => {
            expect(sample).toBe(0x7f);
          })
          .then(done);
      });
    });
    it("can read penultimate sample", done => {
      const reader = new RiffWaveReader(file);
      // 81 81 81 81 80 80 80 [7F] 7F 7E 7E 7E 7E 7E 7E 7E 7E .. .. ..
      reader.readChunks().then(({ format }) => {
        reader
          .readSample(channel, format.sampleCount - 2)
          .then(sample => {
            expect(sample).toBe(0x7f);
          })
          .then(done);
      });
    });
  });
});
