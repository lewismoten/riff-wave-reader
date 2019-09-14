import RiffWaveReader from "../src/index.js";
import Reader from "../src/reader.js";

import path from "path";

describe("24 bit mono samples", () => {
  const mono = 0;
  let reader;
  let sampleCount;
  beforeAll(() => {
    const file = path.join(__dirname, "../samples/24-bit-16khz-mono-01.wav");
    reader = new RiffWaveReader(new Reader(file));
    return reader.readChunks().then(({ data }) => {
      sampleCount = data.sampleCount;
    });
  });
  describe("at start", () => {
    const values = [
      0,
      327680,
      720896,
      1048576,
      1441792,
      1769472,
      2162688,
      2490368,
      2818048,
      3145728,
      3473408,
      3801088,
      4063232,
      4390912,
      4653056,
      4915200
    ];
    for (let i = 0; i < values.length; i++) {
      it(`reads sample ${i}`, () =>
        reader.readSample(mono, i).then(actualValue => {
          expect(actualValue).toBe(values[i]);
        }));
    }
  });
  describe("at end", () => {
    const values = [
      -4325376,
      -4587520,
      -4849664,
      -5111808,
      -5308416,
      -5570560,
      -5767168,
      -5963776,
      -6094848,
      -6225920,
      -6356992,
      -6488064,
      -6553600,
      -6684672,
      -6684672,
      -6750208
    ];
    for (let i = 0; i < values.length; i++) {
      it(`reads sample ${sampleCount - values.length + i}`, () =>
        reader
          .readSample(mono, sampleCount - values.length + i)
          .then(actualValue => {
            expect(actualValue).toBe(values[i]);
          }));
    }
  });
});
