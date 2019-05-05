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
    if (Array.isArray(this.reader)) {
      return new Promise(resolve =>
        resolve(this.reader.slice(offset, offset + size + 1))
      );
    }
    return this.reader.read(offset, size);
  }

  readSample(channel, index) {
    return this.readChunks().then(({ format }) => {
      const position =
        format.sampleStart +
        index * format.sampleSize +
        (channel * format.bitsPerSample) / 8;
      const size = format.bitsPerSample / 8;
      return this._read(position, size).then(buffer => int8(buffer, 0));
    });
  }
  readChunks() {
    return this._read(0, 44).then(buffer => {
      // RIFF
      const tag = ascii(buffer, 0, 4);
      if (tag !== "RIFF") throw errorRiffTag;

      let riffSize = int32(buffer, 4);

      const format = ascii(buffer, 8, 4);
      if (format !== "WAVE") errorRiffFormat;

      const riffChunk = { tag, size: riffSize, format };

      // Format
      const id = ascii(buffer, 12, 4);
      if (id !== "fmt ") throw errorFormatId;
      const formatSize = int32(buffer, 16);
      const type = int16(buffer, 20);
      const channels = int16(buffer, 22);
      const sampleRate = int32(buffer, 24);
      const byteRate = int32(buffer, 28);
      const blockAlignment = int16(buffer, 32);
      const bitsPerSample = int16(buffer, 34);

      // Calculations
      const typeName = type === 1 ? "PCM" : unknown;
      const sampleSize = (channels * bitsPerSample) / 8;

      const tlvSize = 8;
      const riffChunkSize = tlvSize + 4;
      const formatChunkSize = tlvSize + formatSize;
      const dataChunkOffset = tlvSize;
      const sampleStart = riffChunkSize + formatChunkSize + dataChunkOffset;

      let rawDataSize = riffSize - sampleStart;
      const sampleCount = rawDataSize / ((channels * bitsPerSample) / 8);
      const duration = sampleCount / sampleRate;
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
        sampleSize,
        sampleStart,
        sampleCount,
        duration
      };

      // Data
      let dataChunk;
      if (formatSize === 16) {
        dataChunk = {
          id: ascii(buffer, 36, 4),
          size: int32(buffer, 40),
          start: 44
        };
        if (dataChunk.id !== "data") throw errorDataId;
      }

      return {
        riff: riffChunk,
        format: formatChunk,
        data: dataChunk
      };
    });
  }
}
export default RiffWaveReader;

const ascii = (source, position, length) =>
  source.toString("ascii", position, position + length);
const int8 = (source, position) => littleEndian(source, position, 1);
const int16 = (source, position) => littleEndian(source, position, 2);
const int32 = (source, position) => littleEndian(source, position, 4);
const littleEndian = (source, position, length) => {
  let value = 0;
  for (let i = length - 1; i >= 0; i--) {
    value *= 0b100000000;
    value += source[position + i];
  }
  return value;
};
