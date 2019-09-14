import {
  ascii,
  uint8,
  uint16,
  int16,
  uint32,
  int24
} from "./converter";

const errorRiffTag = "RIFF chunk has wrong tag.";
const errorRiffFormat = "RIFF chunk specifies invalid format";
const errorFormatId = "Format chunk id is invalid";
const unknown = "Unknown";
const errorDataId = "Data chunk id is invalid";

export class RiffWaveReader {
  constructor(reader) {
    this.reader = reader;
  }

  _read(offset, size) {
    const reader = this.reader;
    if (Array.isArray(reader)) {
      return new Promise(resolve =>
        resolve(reader.slice(offset, offset + size + 1))
      );
    } else if (
      reader.constructor &&
      reader.constructor.name === "ArrayBuffer"
    ) {
      return new Promise(resolve =>
        resolve(new Uint8Array(reader.slice(offset, offset + size + 1)))
      );
    }
    return reader.read(offset, size);
  }

  readSample(channel, index) {
    return this.readChunks().then(({ format, data }) => {
      const position =
        data.start +
        index * format.sampleSize +
        (channel * format.bitsPerSample) / 8;
      const size = format.bitsPerSample / 8;
      return this._read(position, size).then(buffer => {
        switch(size) {
          default:
          case 1:return uint8(buffer, 0);
          case 2: return int16(buffer, 0);
          case 3: return int24(buffer, 0);
        }

      });
    });
  }
  readChunks() {
    if (this._chunks) {
      return new Promise(resolve => resolve(this._chunks));
    }
    return this._read(0, 44).then(buffer => {
      // RIFF
      const tag = ascii(buffer, 0, 4);
      if (tag !== "RIFF") throw errorRiffTag;

      let riffSize = uint32(buffer, 4);

      const format = ascii(buffer, 8, 4);
      if (format !== "WAVE") errorRiffFormat;

      const riffChunk = { tag, size: riffSize, format };

      // Format
      const id = ascii(buffer, 12, 4);
      if (id !== "fmt ") throw errorFormatId;
      const formatSize = uint32(buffer, 16);
      const type = uint16(buffer, 20);
      const channels = uint16(buffer, 22);
      const sampleRate = uint32(buffer, 24);
      const byteRate = uint32(buffer, 28);
      const blockAlignment = uint16(buffer, 32);
      const bitsPerSample = uint16(buffer, 34);

      // Calculations
      const typeName = type === 1 ? "PCM" : unknown;
      const sampleSize = (channels * bitsPerSample) / 8;

      const tagSize = 4;
      const lengthSize = 4;
      const tlvSize = tagSize + lengthSize;
      const riffChunkSize = tlvSize + 4; // WAVE
      const formatChunkSize = tlvSize + formatSize;
      const dataChunkStart = riffChunkSize + formatChunkSize;

      const formatChunk = {
        id,
        size: formatSize,
        type,
        channels,
        sampleRate,
        byteRate,
        blockAlignment,
        bitsPerSample,
        typeName,
        sampleSize
      };

      // Data
      let dataChunk;
      const dataId = ascii(buffer, dataChunkStart, tagSize);
      if (dataId !== "data") throw errorDataId;
      const dataSize = uint32(buffer, dataChunkStart + tagSize);
      const sampleStart = dataChunkStart + tlvSize;
      const sampleCount = dataSize / blockAlignment;
      const duration = sampleCount / sampleRate;
      dataChunk = {
        id: dataId,
        size: dataSize,
        start: sampleStart,
        sampleCount,
        duration
      };

      return (this._chunks = {
        riff: riffChunk,
        format: formatChunk,
        data: dataChunk
      });
    });
  }
}
export default RiffWaveReader;
