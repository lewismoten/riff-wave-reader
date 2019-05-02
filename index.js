const fs = require("fs");
const path = require("path");

// TODO: Don't read entire file into memory
let buffer = Buffer.from(
  fs.readFileSync(path.join(__dirname, "samples/hello.wav"))
);

// Read a RIFF - Resource Interchange File Format.
const getFileType = buffer => buffer.toString("ascii", 0, 4);
const getFileSize = buffer => buffer.readInt32LE(4);
const getFileTypeHeader = buffer => buffer.toString("ascii", 8, 12);
const getFormatChunkMarker = buffer => buffer.toString("ascii", 12, 16);
const getFormatLength = buffer => buffer.readInt32LE(16);
const getFormatType = buffer => buffer.readInt16LE(20);
const getChannels = buffer => buffer.readInt16LE(22);
const getSampleRate = buffer => buffer.readInt32LE(24);
const getByteRate = buffer => buffer.readInt32LE(28);
const getBlockAlignment = buffer => buffer.readInt32LE(32);
const getBitsPerSample = buffer => buffer.readInt16LE(34);
const getDataChunkHeader = buffer => buffer.toString("ascii", 36, 40);
const getDataSectionSize = buffer => buffer.readInt32LE(40);
const getChannelSample = (buffer, channel, index) => {
  const bitsPerSample = getBitsPerSample(buffer);
  const channels = getChannels(buffer);
  const chunkSize = (channels * bitsPerSample) / 8;
  const offset = 44 + index * chunkSize + channel * bitsPerSample;
  if (bitsPerSample === 8) return buffer.readUInt8(offset);
  if (bitsPerSample === 16) return buffer.readInt16LE(offset);
  if (bitsPerSample === 32) return buffer.readInt32LE(offset);
};
const getSampleValueRange = bitsPerSample => {
  if (bitsPerSample === 8) return [0, 255]; // [-128, 127];
  if (bitsPerSample === 16) return [-32768, 32767];
  if (bitsPerSample === 32) return [-2147483648, 2147483647];
};

// Riff chunk
const fileType = getFileType(buffer);
const fileSize = getFileSize(buffer);
const fileTypeHeader = getFileTypeHeader(buffer);
// format chunk
const formatChunkMarker = getFormatChunkMarker(buffer);
const formatLength = getFormatLength(buffer);
const formatType = getFormatType(buffer);
const channels = getChannels(buffer);
const sampleRate = getSampleRate(buffer);
const byteRate = getByteRate(buffer);
const blockAlignment = getBlockAlignment(buffer);
const bitsPerSample = getBitsPerSample(buffer);
// data chunk
const dataChunkHeader = getDataChunkHeader(buffer);
const dataSectionSize = getDataSectionSize(buffer);

const sampleCount = (8 * dataSectionSize) / (channels * bitsPerSample);
const sampleSize = (channels * bitsPerSample) / 8;
const duration = fileSize / byteRate;

// NOTE: actual file size may be larger than fileSize variable
// if extra content appears after data. ie - metadata
const details = {
  bufferLength: buffer.length,
  fileType, // "RIFF"
  fileSize,
  fileTypeHeader, // "WAVE"
  formatChunkMarker, // "fmt "
  formatLength,
  formatType: formatType === 1 ? "PCM" : formatType,
  channels, // 1 - mono; 2 - stereo
  sampleRate,
  byteRate,
  blockAlignment,
  bitsPerSample, // 8, 16, 32
  dataChunkHeader, // "data"
  dataSectionSize, // PCM data
  sampleCount,
  sampleSize, // bytes
  duration // seconds
};

console.log(JSON.stringify(details, null, " "));
