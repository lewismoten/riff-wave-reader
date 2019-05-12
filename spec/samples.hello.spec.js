import RiffWaveReader from "../src/index.js";
import Reader from "../src/reader.js";

import path from "path";

describe("hello.wav samples", () => {
  const mono = 0;
  let reader;
  let sampleCount;
  const getValues = byteHex => byteHex.split(" ").map(v => parseInt(v, 16));
  beforeAll(() => {
    const file = path.join(__dirname, "../samples/hello.wav");
    reader = new RiffWaveReader(new Reader(file));
    return reader.readChunks().then(({ data }) => {
      sampleCount = data.sampleCount;
    });
  });
  describe("at start", () => {
    const values = getValues("7F 80 80 7E 7F 80 7F 7F 81 81 80 7E 7E 80 81 81");
    for (let i = 0; i < values.length; i++) {
      it(`reads sample ${i}`, () =>
        reader.readSample(mono, i).then(actualValue => {
          expect(actualValue).toBe(values[i]);
        }));
    }
  });
  describe("at end", () => {
    const values = getValues("81 81 81 80 80 80 7F 7F 7E 7E 7E 7E 7E 7E 7E 7E");
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
