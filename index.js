const fs = require("fs");
const path = require("path");

// TODO: Don't read entire file into memory
let buffer = Buffer.from(fs.readFileSync(path.join(__dirname, "hello.wav")));

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

// let's write out the samples as an image...

let imageWidth = 128;
const imageHeight = 32;

// plot the samples on a graph
const bmp = [];
for (let y = 0; y < imageHeight; y++) {
  bmp[y] = "";
  for (let x = 0; x < imageWidth; x++) {
    bmp[y] += "0";
  }
}

let [, max] = getSampleValueRange(bitsPerSample);
const channelSamples = {};
for (let i = 0; i < channels; i++) {
  channelSamples[i] = [];
  for (let j = 0; j < sampleCount; j++) {
    let x = Math.floor((j / sampleCount) * (imageWidth - 1));
    let v = getChannelSample(buffer, i, j);
    let y = Math.floor((v / max) * (imageHeight - 1));

    let scan = bmp[y];
    bmp[y] = scan.substr(0, x) + "1" + scan.substr(x + 1);
  }
}

// create an image from the graph
const fileHeaderSize = 14;
const imageHeaderSize = 40;
const colorTableSize = 2 * 4;
const imageDataSize = (imageWidth / 8) * imageHeight;

const imageFileSize =
  fileHeaderSize + imageHeaderSize + colorTableSize + imageDataSize;
const image = Buffer.alloc(imageFileSize);

// File Header
let o = 0;
image.write("BM", o, 2, "ascii"); // file type
o += 2;
image.writeInt32LE(imageFileSize, o); // file size
o += 4;
image.writeInt16LE(0, o); // reserved
o += 2;
image.writeInt16LE(0, o); // reserved
o += 2;
image.writeInt32LE(14, o); // offset to pixel data
o += 4;
// Image Header
image.writeInt32LE(40, o); // header size
o += 4;
image.writeInt32LE(imageWidth, o); // width
o += 4;
image.writeInt32LE(imageHeight, o); // height
o += 4;
image.writeInt16LE(1, o); // planes
o += 2;
image.writeInt16LE(1, o); // bits per mixel 1,4,8,16,24,32
o += 2;
image.writeInt32LE(0, o); // compression - none
o += 4;
image.writeInt32LE(0, o); // image size - N/A: calculates uncompressed from width/height
o += 4;
image.writeInt32LE(0, o); // pixels per horizonal meter - no preference
o += 4;
image.writeInt32LE(0, o); // pixels per vertical meter - no preference
o += 4;
image.writeInt32LE(2, o); // color map entry count
o += 4;
image.writeInt32LE(0, o); // important colors - all
o += 4;
// Color Table
// black
image.writeInt32LE(0x000000, o);
o += 4;
// white
image.writeInt32LE(0xffffff, o);
o += 4;
// pixel data

// bottom to top
for (let y = imageHeight - 1; y >= 0; y--) {
  // 8 pixels at a time, left to right
  for (let x = 0; x < imageWidth; x += 8) {
    image.writeUInt8(parseInt(bmp[y].substr(x, 8), 2), o);
    o += 1;
  }
}

fs.writeFileSync(path.join(__dirname, "hello.bmp"), image);
