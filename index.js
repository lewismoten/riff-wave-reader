import { readRiffHeader } from "./read-riff--header.js";
import { readFormatHeader } from "./read-format-header.js";
import { readDataHeader } from "./read-data-header.js";

export class Reader {
  constructor(file) {
    this.file = file;
  }
  readRiff() {
    return readRiffHeader(this);
  }

  readFormat() {
    return readFormatHeader(this);
  }
  readDataHeader() {
    return readDataHeader(this);
  }
}
export default Reader;

/*

const getChannelSample = (buffer, channel, index) => {
  const bitsPerSample = getBitsPerSample(buffer);
  const channels = getChannels(buffer);
  const chunkSize = (channels * bitsPerSample) / 8;
  const offset = 44 + index * chunkSize + channel * bitsPerSample;
  if (bitsPerSample === 8) return buffer.readUInt8(offset);
  if (bitsPerSample === 16) return buffer.readInt16LE(offset);
  if (bitsPerSample === 32) return buffer.readInt32LE(offset);
};
const getSampleValueRange = bitsPerSample => {
  if (bitsPerSample === 8) return [0, 255]; // [-128, 127];
  if (bitsPerSample === 16) return [-32768, 32767];
  if (bitsPerSample === 32) return [-2147483648, 2147483647];
};

const sampleCount = (8 * dataSectionSize) / (channels * bitsPerSample);
const duration = fileSize / byteRate;
*/
