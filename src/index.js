const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.read);

const errorOpeningFile = "Unable to open file";
const errorRiffTag = "RIFF chunk has wrong tag.";
const errorRiffFormat = "RIFF chunk specifies invalid format";
const errorFormatId = "Format chunk id is invalid";
const unknown = "Unknown";
const errorDataId = "Data chunk id is invalid";
const errorPositionOutOfRange = "Data read out of range";

export class RiffWaveReader {
  constructor(source) {
    this.source = source;
  }

  readSample(channel, index) {
    return this.readChunks().then(({ format }) => {
      const position =
        format.sampleStart +
        index * format.sampleSize +
        (channel * format.bitsPerSample) / 8;
      const size = format.bitsPerSample / 8;
      return this.getBuffer(position, size).then(buffer => buffer.readUInt8(0));
    });
  }
  readChunks() {
    return this.getBuffer(0, 44).then(buffer => {
      // RIFF
      const tag = buffer.toString("ascii", 0, 4);
      if (tag !== "RIFF") throw errorRiffTag;

      let riffSize = buffer.readInt32LE(4);

      const format = buffer.toString("ascii", 8, 12);
      if (format !== "WAVE") errorRiffFormat;

      const riffChunk = { tag, size: riffSize, format };

      // Format
      const id = buffer.toString("ascii", 12, 16);
      if (id !== "fmt ") throw errorFormatId;
      const formatSize = buffer.readInt32LE(16);
      const type = buffer.readInt16LE(20);
      const channels = buffer.readInt16LE(22);
      const sampleRate = buffer.readInt32LE(24);
      const byteRate = buffer.readInt32LE(28);
      const blockAlignment = buffer.readInt16LE(32);
      const bitsPerSample = buffer.readInt16LE(34);

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
          id: buffer.toString("ascii", 36, 40),
          size: buffer.readInt32LE(40),
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
  getBuffer(offset, size) {
    return new Promise((resolve, reject) => {
      if (typeof this.source === "string") {
        this.getBufferFromFile(offset, size, this.source)
          .then(resolve)
          .catch(reject);
      } else if (Buffer.isBuffer(this.source)) {
        this.getBufferFromBuffer(offset, size, this.source)
          .then(resolve)
          .catch(reject);
      } else if (Array.isArray(this.source)) {
        this.getBufferFromArray(offset, size, this.source)
          .then(resolve)
          .catch(reject);
      } else {
        reject("Unknown source: " + this.source);
      }
    });
  }
  getBufferFromArray(offset, size, array) {
    return this.getBufferFromBuffer(offset, size, Buffer.from(array));
  }
  getBufferFromBuffer(offset, size, buffer) {
    return new Promise((resolve, reject) => {
      if (offset + size > buffer.length) {
        reject(errorPositionOutOfRange);
      } else {
        resolve(buffer.slice(offset, offset + size));
      }
    });
  }
  getBufferFromFile(offset, size, file) {
    return new Promise((resolve, reject) => {
      fs.open(file, "r", (openError, fileDescriptor) => {
        if (openError) {
          reject(errorOpeningFile);
        } else {
          const myBuffer = Buffer.alloc(size);
          read(fileDescriptor, myBuffer, 0, size, offset)
            .then(({ buffer, bytesRead }) =>
              bytesRead < size
                ? reject(errorPositionOutOfRange)
                : resolve(buffer)
            )
            .then(buffer => {
              return new Promise((closeResolve, closeReject) => {
                fs.close(fileDescriptor, closeError => {
                  closeError && closeReject(closeError);
                  closeResolve(buffer);
                });
              });
            });
        }
      });
    });
  }
}
export default RiffWaveReader;
