import RiffWaveReader from "../src/index.js";
import Reader from "../src/reader.js";

import path from "path";

const file = path.join(__dirname, "../samples/16-bit-4khz-mono-01.wav");
const mono = 0;

describe("Signed 16 bit wave file", () => {
      describe("read last samples", () => {
        let reader;
        let sampleCount;
        const lastSamples = [
          0x4eda, 0x45a6, 0x689b, 0xbdbe
        ];
        beforeAll((done) => {
          reader = new RiffWaveReader(new Reader(file));
          return reader.readChunks().then(({ data }) => { sampleCount = data.sampleCount; done()})
        });
        for (let i = 0; i < lastSamples.length; i++) {
          it(`can read last sample ${i + 1} of ${lastSamples.length}`, () => reader
                  .readSample(mono, sampleCount - lastSamples.length + i)
                  .then(actualValue => {
                    expect(actualValue).toBe(lastSamples[i]);
                  }));
        }
      })
  });
