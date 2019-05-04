const fs = require("fs");
const util = require("util");

import {
  errorOpeningFile,
  errorDataHeaderTruncated,
  errorDataId
} from "./en-us.js";

const read = util.promisify(fs.read);

export const readDataHeader = context =>
  new Promise((resolve, reject) => {
    if (context.dataHeader) {
      resolve(context.dataHeader);
    } else {
      context.readFormat().then(({ size: formatSize }) => {
        fs.open(context.file, "r", (openError, fileDescriptor) => {
          if (openError) {
            reject(errorOpeningFile);
          } else {
            const position = 20 + formatSize;
            const size = 8;
            const myBuffer = Buffer.alloc(size);
            const bufferPosition = 0;

            const validateBytesRead = ({ buffer, bytesRead }) => {
              if (bytesRead < buffer.length) throw errorDataHeaderTruncated;
              return { buffer, target: {} };
            };
            const readId = ({ buffer, target }) => {
              const id = buffer.toString("ascii", 0, 4);
              if (id !== "data") throw errorDataId;
              target.id = id;
              return { buffer, target };
            };
            const readSize = ({ buffer, target }) => {
              const size = buffer.readInt32LE(4);
              target.size = size;
              return { buffer, target };
            };

            const cacheResults = ({ target }) => (context.dataHeader = target);
            const calculateStart = ({ buffer, target }) => {
              target.start = position + size;
              return { buffer, target };
            };

            read(fileDescriptor, myBuffer, bufferPosition, size, position)
              .then(validateBytesRead)
              .then(readId)
              .then(readSize)
              .then(calculateStart)
              .then(cacheResults)
              .then(resolve)
              .catch(reject);
          }
        });
      });
    }
  });
