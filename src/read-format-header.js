import { errorFormatId, unknown } from "./en-us.js";

export const readFormatHeader = context =>
  new Promise((resolve, reject) => {
    if (context.format) {
      resolve(context.format);
    }
    context.readRiff().then(({ size: dataSize }) => {
      return context
        .getBuffer(12, 24)
        .then(buffer => {
          const id = buffer.toString("ascii", 0, 4);
          const size = buffer.readInt32LE(4);
          const type = buffer.readInt16LE(8);
          const channels = buffer.readInt16LE(10);
          const sampleRate = buffer.readInt32LE(12);
          const byteRate = buffer.readInt32LE(16);
          const blockAlignment = buffer.readInt16LE(20);
          const bitsPerSample = buffer.readInt16LE(22);
          const typeName = type === 1 ? "PCM" : unknown;
          const sampleSize = (channels * bitsPerSample) / 8;

          const tlvSize = 8;
          const riffChunkSize = tlvSize + 4;
          const formatChunkSize = tlvSize + size;
          const dataChunkOffset = tlvSize;
          const sampleStart = riffChunkSize + formatChunkSize + dataChunkOffset;

          let rawDataSize = dataSize - sampleStart;
          const sampleCount = rawDataSize / ((channels * bitsPerSample) / 8);
          const duration = sampleCount / sampleRate;

          if (id !== "fmt ") reject(errorFormatId);
          else
            resolve(
              (context.format = {
                id,
                size,
                type,
                channels,
                sampleRate,
                byteRate,
                blockAlignment,
                bitsPerSample,
                // calculations
                typeName,
                sampleSize,
                sampleStart,
                sampleCount,
                duration
              })
            );
        })
        .catch(reject);
    });
  });
