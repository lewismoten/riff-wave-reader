# Riff Wave Reader

[![Build Status](https://travis-ci.org/lewismoten/riff-wave-reader.svg?branch=master)](https://travis-ci.org/lewismoten/riff-wave-reader)

This library reads the data within RIFF file with it's contents formatted as a WAVE file containing PCM data.

# How to use

```javascript
import RiffWaveReader from "riff-wave-reader";
const reader = new RiffWaveReader("./example.wav");
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
