const fs = require("fs");
// const path = require("path");

export class Reader {
  constructor(file) {
    this.file = file;
  }
  readRiff() {
    return new Promise((resolve, reject) => {
      const position = 0;
      const size = 12;
      const buffer = Buffer.alloc(size);
      delete this.riff;

      fs.open(this.file, "r", (openError, fileDescriptor) => {
        if (openError) {
          closeAndReject(openError, fileDescriptor);
        } else {
          fs.read(
            fileDescriptor,
            buffer,
            0,
            size,
            position,
            (readError, bytesRead) => {
              if (readError) {
                closeAndReject(readError, fileDescriptor);
              } else if (bytesRead < size) {
                closeAndReject(
                  new Error("Invalid RIFF chunk descriptor"),
                  fileDescriptor
                );
              } else {
                this.riff = {
                  tag: buffer.toString("ascii", 0, 4),
                  size: buffer.readInt32LE(4),
                  format: buffer.toString("ascii", 8, 12)
                };
                closeAndResolve(this.riff, fileDescriptor);
              }
            }
          );
        }
      });
      const closeAndReject = (error, fileDescriptor) => {
        if (fileDescriptor === void 0) {
          reject(error);
        } else {
          fs.close(fileDescriptor, closeError => {
            reject(error || closeError);
          });
        }
      };
      const closeAndResolve = (data, fileDescriptor) => {
        if (fileDescriptor === void 0) {
          resolve(data);
        } else {
          fs.close(fileDescriptor, closeError => {
            closeError ? reject(closeError) : resolve(data);
          });
        }
      };
    });
  }
  readFormat() {
    return new Promise((resolve, reject) => {
      const position = 12;
      const size = 24;
      const buffer = Buffer.alloc(size);
      if ("format" in this) {
        resolve(this.format);
        return;
      }

      fs.open(this.file, "r", (openError, fileDescriptor) => {
        if (openError) {
          closeAndReject(openError, fileDescriptor);
        } else {
          fs.read(
            fileDescriptor,
            buffer,
            0,
            size,
            position,
            (readError, bytesRead) => {
              if (readError) {
                closeAndReject(readError, fileDescriptor);
              } else if (bytesRead < size) {
                closeAndReject(
                  new Error("Invalid Format sub-chunk"),
                  fileDescriptor
                );
              } else {
                this.format = {
                  id: buffer.toString("ascii", 0, 4),
                  size: buffer.readInt32LE(4),
                  type: buffer.readInt16LE(8),
                  channels: buffer.readInt16LE(10),
                  sampleRate: buffer.readInt32LE(12),
                  byteRate: buffer.readInt32LE(16),
                  blockAlignment: buffer.readInt16LE(20),
                  bitsPerSample: buffer.readInt16LE(22)
                };
                this.format.typeName =
                  this.format.type === 1 ? "PCM" : "Unknown";
                closeAndResolve(this.format, fileDescriptor);
              }
            }
          );
        }
      });
      const closeAndReject = (error, fileDescriptor) => {
        if (fileDescriptor === void 0) {
          reject(error);
        } else {
          fs.close(fileDescriptor, closeError => {
            reject(error || closeError);
          });
        }
      };
      const closeAndResolve = (data, fileDescriptor) => {
        if (fileDescriptor === void 0) {
          resolve(data);
        } else {
          fs.close(fileDescriptor, closeError => {
            closeError ? reject(closeError) : resolve(data);
          });
        }
      };
    });
  }
  readDataHeader() {
    return new Promise((resolve, reject) => {
      this.readFormat().then(format => {
        const position = 20 + format.size;
        const size = 8;
        const buffer = Buffer.alloc(size);
        delete this.format;

        fs.open(this.file, "r", (openError, fileDescriptor) => {
          if (openError) {
            closeAndReject(openError, fileDescriptor);
          } else {
            fs.read(
              fileDescriptor,
              buffer,
              0,
              size,
              position,
              (readError, bytesRead) => {
                if (readError) {
                  closeAndReject(readError, fileDescriptor);
                } else if (bytesRead < size) {
                  closeAndReject(
                    new Error("Invalid data sub-chunk"),
                    fileDescriptor
                  );
                } else {
                  this.format = {
                    id: buffer.toString("ascii", 0, 4),
                    size: buffer.readInt32LE(4),
                    startPosition: position + size
                  };
                  closeAndResolve(this.format, fileDescriptor);
                }
              }
            );
          }
        });
      });

      const closeAndReject = (error, fileDescriptor) => {
        if (fileDescriptor === void 0) {
          reject(error);
        } else {
          fs.close(fileDescriptor, closeError => {
            reject(error || closeError);
          });
        }
      };
      const closeAndResolve = (data, fileDescriptor) => {
        if (fileDescriptor === void 0) {
          resolve(data);
        } else {
          fs.close(fileDescriptor, closeError => {
            closeError ? reject(closeError) : resolve(data);
          });
        }
      };
    });
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
const sampleSize = (channels * bitsPerSample) / 8;
const duration = fileSize / byteRate;
*/
