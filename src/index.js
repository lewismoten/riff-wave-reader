import { readRiffHeader } from "./read-riff--header.js";
import { readFormatHeader } from "./read-format-header.js";
import { readDataHeader } from "./read-data-header.js";
import { readSample } from "./read-sample.js";
const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.read);

import { errorOpeningFile, errorPositionOutOfRange } from "./en-us.js";

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
      if (typeof this.file === "string") {
        fs.open(this.file, "r", (openError, fileDescriptor) => {
          if (openError) {
            reject(errorOpeningFile);
          } else {
            const myBuffer = Buffer.alloc(size);
            read(fileDescriptor, myBuffer, offset, size, 0)
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
      }
    });
  }
}
export default Reader;
