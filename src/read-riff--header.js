import { errorRiffTag, errorRiffSize, errorRiffFormat } from "./en-us.js";

export const readRiffHeader = context =>
  new Promise((resolve, reject) => {
    if (context.riff) {
      resolve(context.riff);
    }
    context.getBuffer(0, 12).then(buffer => {
      const tag = buffer.toString("ascii", 0, 4);
      const size = buffer.readInt32LE(4);
      const format = buffer.toString("ascii", 8, 12);
      if (tag !== "RIFF") reject(errorRiffTag);
      else if (size < 40) reject(errorRiffSize);
      else if (format !== "WAVE") reject(errorRiffFormat);
      else
        resolve(
          (context.riff = {
            tag,
            size,
            format
          })
        );
    });
  });
