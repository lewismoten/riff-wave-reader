const fs = require("fs");
const util = require("util");

import {
  errorOpeningFile,
  errorSampleNotFound,
  errorSampleTruncated
} from "./en-us.js";

const read = util.promisify(fs.read);

/*
const getChannelSample = (buffer, channel, index) => {
  if (bitsPerSample === 8) return buffer.readUInt8(offset);
  if (bitsPerSample === 16) return buffer.readInt16LE(offset);
  if (bitsPerSample === 32) return buffer.readInt32LE(offset);
};
const getSampleValueRange = bitsPerSample => {
  if (bitsPerSample === 8) return [0, 255]; // [-128, 127];
  if (bitsPerSample === 16) return [-32768, 32767];
  if (bitsPerSample === 32) return [-2147483648, 2147483647];
};
*/

export const readSample = (context, channel, index) =>
  new Promise((resolve, reject) => {
    context.readFormat().then(({ sampleStart, sampleSize, bitsPerSample }) => {
      fs.open(context.file, "r", (openError, fileDescriptor) => {
        if (openError) {
          reject(errorOpeningFile);
        } else {
          const position =
            sampleStart + index * sampleSize + (channel * bitsPerSample) / 8;
          const size = bitsPerSample / 8;
          const myBuffer = Buffer.alloc(size);
          const bufferPosition = 0;
          const validateBytesRead = ({ buffer, bytesRead }) => {
            if (bytesRead === 0) throw errorSampleNotFound;
            if (bytesRead < buffer.length) throw errorSampleTruncated;
            return buffer;
          };
          const readSample = buffer => {
            return buffer.readUInt8(0);
          };
          read(fileDescriptor, myBuffer, bufferPosition, size, position)
            .then(validateBytesRead)
            .then(readSample)
            .then(resolve)
            .catch(reject);
        }
      });
    });
  });
