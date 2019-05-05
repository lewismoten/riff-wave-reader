# Riff Wave Reader

[![Build Status](https://travis-ci.org/lewismoten/riff-wave-reader.svg?branch=master)](https://travis-ci.org/lewismoten/riff-wave-reader)

This library reads the data within RIFF file with it's contents formatted as a WAVE file containing PCM data.

# How to use

```javascript
import RiffWaveReader from "riff-wave-reader";
let reader;

// from file name
reader = new RiffWaveReader("./samples/hello.wav");

// from array
const data =
  "52 49 46 46 d5 10 00 00 57 41 56 45 66 6d 74 20" +
  "10 00 00 00 01 00 01 00 40 1f 00 00 40 1f 00 00" +
  "01 00 08 00 64 61 74 61 b1 10 00 00 7f";
const array = data.split(" ").map(v => parseInt(v, 16));
reader = new RiffWaveReader(array);

// from buffer
reader = new RiffWaveReader(Buffer.from(array));

// Read header chunks
reader.readChunks().then(chunks => {
  console.log(chunks);
});
/*
{
  riff: { tag: "RIFF", size: 4309, format: "WAVE" },
  format: {
    id: "fmt ", size: 16, type: 1, channels: 1, sampleRate: 8000,
    byteRate: 8000, blockAlignment: 1, bitsPerSample: 8,
    typeName: "PCM", sampleSize: 1, sampleStart: 44,
    sampleCount: 4265, duration: 0.533125
  },
  data: { id: "data", size: 4273, start: 44 }
}
*/
const channel = 0;
const index = 0;
reader.readSample(channel, index).then(sample => console.log(sample));
// 127
```
