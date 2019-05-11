import RiffWaveReader from "../src/index.js";
import Reader from "../src/reader.js";
const fs = require("fs");
const util = require("util");

import path from "path";

const file = path.join(__dirname, "../samples/hello.wav");
export const errorOpeningFile = "Unable to open file";
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
    sampleSize: 1
  },
  data: {
    id: "data",
    size: 4273,
    start: 44,
    sampleCount: 4273,
    duration: 0.533125
  }
};
// Unsigned Bytes got abovee 127
const firstValue = 127;
const secondValue = 128;
const lastValue = 127;
const penultimateValue = 127;
const penultimate2Value = 128;

describe("riff-wave-reader", () => {
  it("is function", () => {
    expect(typeof RiffWaveReader).toBe("function");
  });
  it("can instantiate", () => {
    const reader = new RiffWaveReader();
    expect(typeof reader).toBe("object");
  });
  describe("desciptors", () => {
    it("can read from file", done => {
      const reader = new RiffWaveReader(new Reader(file));
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
            reader = new RiffWaveReader(new Reader(buffer));
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
    describe("Reader Array", () => {
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
            reader = new RiffWaveReader(new Reader(array));
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
    describe("Raw Array", () => {
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
          expect(sample).toBe(firstValue);
          done();
        });
      });
    });
  });
  describe("Invalid File", () => {
    it("handles missing file", done => {
      const fileName = "this file does not exist";
      const reader = new RiffWaveReader(new Reader(fileName));
      reader.readChunks().catch(e => {
        expect(e).toEqual(errorOpeningFile);
        done();
      });
    });
  });
  describe("RIFF Chunk", () => {
    let reader;
    let riff;
    beforeAll(done => {
      reader = new RiffWaveReader(new Reader(file));
      reader
        .readChunks()
        .then(result => {
          riff = result.riff;
        })
        .then(done);
    });
    it("matches snapshot", () => {
      expect(riff).toEqual(descriptors.riff);
    });
    it("can read tag", () => {
      expect(riff.tag).toBe(descriptors.riff.tag);
    });
    it("can read size", () => {
      expect(riff.size).toBe(descriptors.riff.size);
    });
    it("can read format", () => {
      expect(riff.format).toBe(descriptors.riff.format);
    });
  });
  describe("Format Chunk", () => {
    let reader;
    let format;
    beforeAll(done => {
      reader = new RiffWaveReader(new Reader(file));
      reader
        .readChunks()
        .then(result => {
          format = result.format;
        })
        .then(done);
    });
    it("matches snapshot", () => {
      expect(format).toEqual(descriptors.format);
    });
    it("can read id", () => {
      expect(format.id).toBe(descriptors.format.id);
    });
    it("can read size", () => {
      expect(format.size).toBe(descriptors.format.size);
    });
    it("can read type", () => {
      expect(format.type).toBe(descriptors.format.type);
    });
    it("can read typeName", () => {
      expect(format.typeName).toBe(descriptors.format.typeName);
    });
    it("can read channels", () => {
      expect(format.channels).toBe(descriptors.format.channels);
    });
    it("can read sample rate", () => {
      expect(format.sampleRate).toBe(descriptors.format.sampleRate);
    });
    it("can read byte rate", () => {
      expect(format.byteRate).toBe(descriptors.format.byteRate);
    });
    it("calculates sample size", () => {
      expect(format.sampleSize).toBe(descriptors.format.sampleSize);
    });
    it("calculates sample count", () => {
      expect(format.sampleCount).toBe(descriptors.format.sampleCount);
    });
    it("calculates sample start", () => {
      expect(format.sampleStart).toBe(descriptors.format.sampleStart);
    });
    it("calculates duration in fractional seconds", () => {
      expect(format.duration).toBe(descriptors.format.duration);
    });
    it("has valid byte rate", () => {
      expect(format.byteRate).toBe(
        (descriptors.format.sampleRate *
          descriptors.format.channels *
          descriptors.format.bitsPerSample) /
          8
      );
    });
    it("can read block alignment", () => {
      expect(format.blockAlignment).toBe(descriptors.format.blockAlignment);
    });
    it("has valid block alignment", () => {
      expect(format.blockAlignment).toBe(
        (descriptors.format.channels * descriptors.format.bitsPerSample) / 8
      );
    });
    it("can read bits per sample", () => {
      expect(format.bitsPerSample).toBe(descriptors.format.bitsPerSample);
    });
  });
  describe("Data Chunk Header", () => {
    let reader;
    let dataHeader;
    beforeAll(done => {
      reader = new RiffWaveReader(new Reader(file));
      reader
        .readChunks()
        .then(result => {
          dataHeader = result.data;
        })
        .then(done);
    });
    it("can read id", () => {
      expect(dataHeader.id).toBe(descriptors.data.id);
    });
    it("can read size", () => {
      expect(dataHeader.size).toBe(descriptors.data.size);
    });
    it("calculates start position", () => {
      const tagSize = 4;
      const lengthSize = 4;
      const tlvSize = tagSize + lengthSize;
      const riffHeaderSize = tlvSize + 4;
      const dataHeaderSize = tlvSize;
      const formatHeaderSize = descriptors.format.size + tlvSize;
      expect(dataHeader.start).toBe(
        riffHeaderSize + formatHeaderSize + dataHeaderSize
      );
    });
  });
  describe("Sample", () => {
    const channel = 0;
    it("can read first sample", done => {
      const reader = new RiffWaveReader(new Reader(file));
      reader
        .readSample(channel, 0)
        .then(sample => {
          expect(sample).toBe(firstValue);
        })
        .then(done);
    });
    it("can read second sample", done => {
      const reader = new RiffWaveReader(new Reader(file));
      reader
        .readSample(channel, 1)
        .then(sample => {
          expect(sample).toBe(secondValue);
        })
        .then(done);
    });
    it("can read last sample", done => {
      const reader = new RiffWaveReader(new Reader(file));
      // 81 81 81 81 80 80 80 7F [7F] 7E 7E 7E 7E 7E 7E 7E 7E .. .. ..
      reader.readChunks().then(({ data }) => {
        reader
          .readSample(channel, data.sampleCount - 1)
          .then(sample => {
            expect(sample).toBe(lastValue);
          })
          .then(done);
      });
    });
    it("can read penultimate sample", done => {
      const reader = new RiffWaveReader(new Reader(file));
      // 81 81 81 81 80 80 80 [7F] 7F 7E 7E 7E 7E 7E 7E 7E 7E .. .. ..
      reader.readChunks().then(({ data }) => {
        reader
          .readSample(channel, data.sampleCount - 2)
          .then(sample => {
            expect(sample).toBe(penultimateValue);
          })
          .then(done);
      });
    });
    it("can read penultimate2 sample", done => {
      const reader = new RiffWaveReader(new Reader(file));
      // 81 81 81 81 80 80 80 [7F] 7F 7E 7E 7E 7E 7E 7E 7E 7E .. .. ..
      reader.readChunks().then(({ data }) => {
        reader
          .readSample(channel, data.sampleCount - 3)
          .then(sample => {
            expect(sample).toBe(penultimate2Value);
          })
          .then(done);
      });
    });
  });
});
