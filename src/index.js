import { readRiffHeader } from "./read-riff--header.js";
import { readFormatHeader } from "./read-format-header.js";
import { readDataHeader } from "./read-data-header.js";
import { readSample } from "./read-sample.js";
const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.read);

import { errorOpeningFile, errorPositionOutOfRange } from "./en-us.js";

export class Reader {
  constructor(source) {
    this.source = source;
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
  readSample(channel, index) {
    return readSample(this, channel, index);
  }
  readChunks() {
    return readRiffHeader(this).then(riff => {
      return readFormatHeader(this).then(format => {
        return readDataHeader(this).then(data => {
          return {
            riff,
            format,
            data
          };
        });
      });
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
            .then(o => {
              return new Promise((res, rej) => {
                fs.close(fileDescriptor, e => {
                  e && rej(e);
                  res(o);
                });
                return o;
              });
            });
        }
      });
    });
  }
}
export default Reader;
