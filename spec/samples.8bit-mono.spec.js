import RiffWaveReader from "../src/index.js";
import Reader from "../src/reader.js";

import path from "path";

describe("8 bit stereo samples", () => {
  const mono = 0;
  let reader;
  let sampleCount;
  const getValues = byteHex => byteHex.split(" ").map(v => parseInt(v, 16));
  beforeAll(() => {
    const file = path.join(__dirname, "../samples/8-bit-8000hz-mono-01.wav");
    reader = new RiffWaveReader(new Reader(file));
    return reader.readChunks().then(({ data }) => {
      sampleCount = data.sampleCount;
    });
  });
  describe("at start", () => {
    const values = getValues("80 A2 C1 D8 E4 E5 D9 C3 A5 83 60 41 29 1C 1A 24");
    for (let i = 0; i < values.length; i++) {
      it(`reads sample ${i}`, () =>
        reader.readSample(mono, i).then(actualValue => {
          expect(actualValue).toBe(values[i]);
        }));
    }
  });
  describe("at end", () => {
    const values = getValues("C6 DB E5 E3 D6 BE 9F 7C 5A 3C 26 1A 1B 27 3E 5D");
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
