export const readSample = (context, channel, index) =>
  new Promise((resolve, reject) => {
    context.readFormat().then(({ sampleStart, sampleSize, bitsPerSample }) => {
      const position =
        sampleStart + index * sampleSize + (channel * bitsPerSample) / 8;
      const size = bitsPerSample / 8;
      context
        .getBuffer(position, size)
        .then(buffer => resolve(buffer.readUInt8(0)))
        .catch(reject);
    });
  });
