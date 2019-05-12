import RiffWaveReader from "../src/index.js";
import Reader from "../src/reader.js";

import path from "path";

describe("16 bit mono samples", () => {
  const mono = 0;
  let reader;
  let sampleCount;
  beforeAll(() => {
    const file = path.join(__dirname, "../samples/16-bit-4khz-mono-01.wav");
    reader = new RiffWaveReader(new Reader(file));
    return reader.readChunks().then(({ data }) => {
      sampleCount = data.sampleCount;
    });
  });
  describe("at start", () => {
    const values = [
      0,
      16710,
      25749,
      22973,
      9651,
      -8103,
      -22131,
      -26010,
      -17944,
      -1645,
      15406,
      25393,
      23718,
      11164,
      -6522,
      -21207
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
      26161,
      21211,
      6515,
      -11159,
      -23720,
      -25392,
      -15406,
      1644,
      17946,
      26007,
      22134,
      8100,
      -9650,
      -22971,
      -25752,
      -16707
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
