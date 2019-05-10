import RiffWaveReader from "../src/index.js";
import Reader from "../src/reader.js";

import path from "path";

describe("Sample Headers", () => {
  it(`hello.wav`, () => hasExpectedHeaders("hello"));
  it(`hello-metadata.wav`, () => hasExpectedHeaders("hello-metadata"));
  it(`8-bit-8000hz-mono-01.wav`, () => hasExpectedHeaders("8-bit-8000hz-mono-01"));
  it(`8-bit-8000hz-mono-02.wav`, () => hasExpectedHeaders("8-bit-8000hz-mono-02"));
  it(`8-bit-8000hz-mono-03.wav`, () => hasExpectedHeaders("8-bit-8000hz-mono-03"));
  it(`8-bit-8000hz-mono-04.wav`, () => hasExpectedHeaders("8-bit-8000hz-mono-04"));
  it(`8-bit-8000hz-stereo-01.wav`, () => hasExpectedHeaders("8-bit-8000hz-stereo-01"));
  it(`8-bit-8000hz-stereo-02.wav`, () => hasExpectedHeaders("8-bit-8000hz-stereo-02"));
  it(`8-bit-16khz-mono-01.wav`, () => hasExpectedHeaders("8-bit-16khz-mono-01"));
  it(`8-bit-16khz-mono-02.wav`, () => hasExpectedHeaders("8-bit-16khz-mono-02"));
  it(`8-bit-16khz-mono-03.wav`, () => hasExpectedHeaders("8-bit-16khz-mono-03"));
  it(`8-bit-16khz-mono-04.wav`, () => hasExpectedHeaders("8-bit-16khz-mono-04"));
  it(`8-bit-16khz-stereo-01.wav`, () => hasExpectedHeaders("8-bit-16khz-stereo-01"));
  it(`8-bit-16khz-stereo-02.wav`, () => hasExpectedHeaders("8-bit-16khz-stereo-02"));
});
const hasExpectedHeaders = name => {
  return new RiffWaveReader(new Reader(path.join(__dirname, `../samples/${name}.wav`)))
    .readChunks()
    .then(chunks => {
      expect(chunks).toEqual(require(`./data/headers/${name}.json`));
    });
}
