const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.read);
const errorOpeningFile = "Unable to open file";
const errorPositionOutOfRange = "Data read out of range";

export class Reader {
  constructor(source) {
    this.source = source;
  }
  read(offset, size) {
    return new Promise((resolve, reject) => {
      if (typeof this.source === "string") {
        this._readFile(offset, size, this.source)
          .then(resolve)
          .catch(reject);
      } else if (Buffer.isBuffer(this.source)) {
        this._readBuffer(offset, size, this.source)
          .then(resolve)
          .catch(reject);
      } else if (Array.isArray(this.source)) {
        this._readArray(offset, size, this.source)
          .then(resolve)
          .catch(reject);
      } else {
        reject("Unknown source: " + this.source);
      }
    });
  }
  _readArray(offset, size, array) {
    return this._readBuffer(offset, size, Buffer.from(array));
  }
  _readBuffer(offset, size, buffer) {
    return new Promise((resolve, reject) => {
      if (offset + size > buffer.length) {
        reject(errorPositionOutOfRange);
      } else {
        resolve(buffer.slice(offset, offset + size));
      }
    });
  }
  _readFile(offset, size, file) {
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
export default Reader;
