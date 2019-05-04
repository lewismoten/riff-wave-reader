const fs = require("fs");
const util = require("util");

import {
  errorOpeningFile,
  errorRiffTruncated,
  errorRiffTag,
  errorRiffSize,
  errorRiffFormat
} from "./en-us.js";

const read = util.promisify(fs.read);

export const readRiffHeader = context =>
  new Promise((resolve, reject) => {
    if (context.riff) {
      resolve(context.riff);
    }
    const position = 0;
    const size = 12;
    const myBuffer = Buffer.alloc(size);

    fs.open(context.file, "r", (openError, fileDescriptor) => {
      if (openError) {
        reject(errorOpeningFile);
      } else {
        read(fileDescriptor, myBuffer, 0, size, position)
          .then(validateBytesRead)
          .then(readTag)
          .then(readSize)
          .then(readFormat)
          .then(cacheResults)
          .then(resolve);
      }
    });
    const validateBytesRead = ({ buffer, bytesRead }) =>
      bytesRead < size ? reject(errorRiffTruncated) : { buffer, target: {} };

    const readTag = ({ buffer, target }) =>
      "RIFF" === (target.tag = buffer.toString("ascii", 0, 4))
        ? { buffer, target }
        : reject(errorRiffTag, target.tag);

    const readSize = ({ buffer, target }) =>
      40 < (target.size = buffer.readInt32LE(4))
        ? { buffer, target }
        : reject(errorRiffSize);

    const readFormat = ({ buffer, target }) =>
      "WAVE" === (target.format = buffer.toString("ascii", 8, 12))
        ? { buffer, target }
        : reject(errorRiffFormat);

    const cacheResults = ({ target }) => (context.riff = target);
  });
