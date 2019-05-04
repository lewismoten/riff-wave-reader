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

    context.readRiff().then(({ size: dataSize }) => {
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
            .then(closeFile)
            .then(calculateTypeName)
            .then(calcSampleSize)
            .then(calcSampleStart)
            .then(calcSampleCount)
            .then(calcDuration)
            .then(cacheResults)
            .then(resolve);
        }
        const closeFile = o => {
          return new Promise((res, rej) => {
            fs.close(fileDescriptor, e => {
              e && rej(e);
              res(o);
            });
            return o;
          });
        };
      });
      const calcSampleStart = ({ buffer, target }) => {
        // data size - start
        // all data
        let sampleStart = 0;
        // except riff header tag + size
        sampleStart += 8;
        // except format tag + size
        sampleStart += 8;
        // except format header + tag + size
        sampleStart += target.size;
        // except data header  / size
        sampleStart += 8;
        sampleStart += 4;
        target.sampleStart = sampleStart;
        return { buffer, target };
      };
      const calcSampleCount = ({ buffer, target }) => {
        // data size - start
        // all data
        let rawDataSize = dataSize - target.sampleStart;
        // let rawDataSize = dataSize;
        // // except riff header tag + size
        // rawDataSize -= 8;
        // // except format tag + size
        // rawDataSize -= 8;
        // // except format header + tag + size
        // rawDataSize -= target.size;
        // // except data header  / size
        // rawDataSize -= 8;
        // rawDataSize -= 4;
        // // last byte = 4309 = riff size
        return (
          (target.sampleCount =
            rawDataSize / ((target.channels * target.bitsPerSample) / 8)) && {
            buffer,
            target
          }
        );
      };
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
    const calcSampleSize = ({ buffer, target }) =>
      (target.sampleSize = (target.channels * target.bitsPerSample) / 8) && {
        buffer,
        target
      };
    const calculateTypeName = ({ buffer, target }) =>
      (target.typeName = target.type === 1 ? "PCM" : unknown) && {
        buffer,
        target
      };
    const calcDuration = ({ buffer, target }) =>
      (target.duration = target.sampleCount / target.sampleRate) && {
        buffer,
        target
      };

    const cacheResults = ({ target }) => (context.format = target);
  });
