const fs = require("fs");
const util = require("util");

import {
  errorOpeningFile,
  errorFormatTruncated,
  errorFormatId,
  unknown
} from "./en-us.js";

const read = util.promisify(fs.read);

export const readFormatHeader = context =>
  new Promise((resolve, reject) => {
    if (context.format) {
      resolve(context.format);
    }
    const position = 12;
    const size = 24;
    const myBuffer = Buffer.alloc(size);

    fs.open(context.file, "r", (openError, fileDescriptor) => {
      if (openError) {
        reject(errorOpeningFile);
      } else {
        read(fileDescriptor, myBuffer, 0, size, position)
          .then(validateBytesRead)
          .then(readId)
          .then(readSize)
          .then(readType)
          .then(readChannels)
          .then(readSampleRate)
          .then(readByteRate)
          .then(readBlockAlignment)
          .then(readBitsPerSample)
          .then(calculateTypeName)
          .then(cacheResults)
          .then(resolve);
      }
    });
    const validateBytesRead = ({ buffer, bytesRead }) =>
      bytesRead < size ? reject(errorFormatTruncated) : { buffer, target: {} };

    const readId = ({ buffer, target }) =>
      "fmt " === (target.id = buffer.toString("ascii", 0, 4))
        ? { buffer, target }
        : reject(errorFormatId, target.tag);

    const readSize = ({ buffer, target }) =>
      (target.size = buffer.readInt32LE(4)) && { buffer, target };

    const readType = ({ buffer, target }) =>
      (target.type = buffer.readInt16LE(8)) && { buffer, target };
    const readChannels = ({ buffer, target }) =>
      (target.channels = buffer.readInt16LE(10)) && { buffer, target };
    const readSampleRate = ({ buffer, target }) =>
      (target.sampleRate = buffer.readInt32LE(12)) && { buffer, target };
    const readByteRate = ({ buffer, target }) =>
      (target.byteRate = buffer.readInt32LE(16)) && { buffer, target };
    const readBlockAlignment = ({ buffer, target }) =>
      (target.blockAlignment = buffer.readInt16LE(20)) && { buffer, target };
    const readBitsPerSample = ({ buffer, target }) =>
      (target.bitsPerSample = buffer.readInt16LE(22)) && { buffer, target };
    const calculateTypeName = ({ buffer, target }) =>
      (target.typeName = target.type === 1 ? "PCM" : unknown) && {
        buffer,
        target
      };

    const cacheResults = ({ target }) => (context.format = target);
  });

// this.format = {
//   id: buffer.toString("ascii", 0, 4),
//   size: buffer.readInt32LE(4),
//   type: buffer.readInt16LE(8),
//   channels: buffer.readInt16LE(10),
//   sampleRate: buffer.readInt32LE(12),
//   byteRate: buffer.readInt32LE(16),
//   blockAlignment: buffer.readInt16LE(20),
//   bitsPerSample: buffer.readInt16LE(22)
// };
// this.format.typeName = this.format.type === 1 ? "PCM" : "Unknown";
//
