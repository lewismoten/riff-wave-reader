import { errorDataId } from "./en-us.js";

export const readDataHeader = context =>
  new Promise((resolve, reject) => {
    if (context.dataHeader) {
      resolve(context.dataHeader);
    } else {
      context.readFormat().then(({ size: formatSize }) => {
        context
          .getBuffer(20 + formatSize, 8)
          .then(buffer => {
            const id = buffer.toString("ascii", 0, 4);
            const size = buffer.readInt32LE(4);
            const start = 20 + formatSize + 8;
            if (id !== "data") reject(errorDataId);
            else resolve((context.dataHeader = { id, size, start }));
          })
          .catch(reject);
      });
    }
  });
