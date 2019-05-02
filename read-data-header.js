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
    }
    context.readFormat().then(({ size: formatSize }) => {
      fs.open(context.file, "r", (openError, fileDescriptor) => {
        if (openError) {
          reject(errorOpeningFile);
        } else {
          const position = 20 + formatSize;
          const size = 8;
          const myBuffer = Buffer.alloc(size);
          read(fileDescriptor, myBuffer, 0, size, position)
            .then(showArguments)
            .then(validateBytesRead)
            .then(readId)
            .then(readSize)
            .then(calculateStart)
            .then(cacheResults)
            .then(resolve)
            .catch(showArguments);

          const showArguments = o => {
            console.log(
              ">>>>>>>>>>>>>>>>>>>",
              JSON.stringify(arguments, null, "  "),
              JSON.stringify(o, null, "  ")
            );
            return o;
          };

          const validateBytesRead = ({ buffer, bytesRead }) => {
            console.log("*******************************************");
            return bytesRead < size
              ? reject(errorDataHeaderTruncated)
              : { buffer, target: {} };
          };

          const readId = ({ buffer, target }) =>
            "data" === (target.id = buffer.toString("ascii", 0, 4))
              ? { buffer, target }
              : reject(errorDataId);

          const readSize = ({ buffer, target }) =>
            (target.size = buffer.readInt32LE(4)) && { buffer, target };
          const calculateStart = ({ buffer, target }) =>
            (target.start = position + size) && { buffer, target };

          const cacheResults = ({ target }) => (context.dataHeader = target);
        }
      });
    });
  });
