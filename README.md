# Riff Wave Reader

[![Build Status](https://travis-ci.org/lewismoten/riff-wave-reader.svg?branch=master)](https://travis-ci.org/lewismoten/riff-wave-reader)

This library reads the data within RIFF file with it's contents formatted as a WAVE file containing PCM data.

![Example Waveform](./docs/example-waveform.png)

# How to use

## Node

````javascript
import RiffWave

# How to use

## Node

```javascript
import Reader from "riff-wave-reader/reader";
let reader;
const channel = 0;
const index = 0;

// from array
const data =
  "52 49 46 46 d5 10 00 00 57 41 56 45 66 6d 74 20 " +
  "10 00 00 00 01 00 01 00 40 1f 00 00 40 1f 00 00 " +
  "01 00 08 00 64 61 74 61 b1 10 00 00 7f";
const array = data.split(" ").map(v => parseInt(v, 16));
reader = new RiffWaveReader(array);

// To handle large files without loading them completely into memory
// from wrapped file, buffer, array, and array buffers
reader = new RiffWaveReader(new Reader("./samples/hello.wav"));
reader = new RiffWaveReader(new Reader(Buffer.from(array)));
reader = new RiffWaveReader(new Reader(array));
reader = new RiffWaveReader(new ArrayBuffer(array));

// Read header chunks
reader.readChunks().then(chunks => {
  console.log(chunks);
});
reader.readSample(channel, index).then(sample => console.log(sample));
// 127
````

The chunks would be written out as:

```json
{
  "riff": {
    "tag": "RIFF",
    "size": 4309,
    "format": "WAVE"
  },
  "format": {
    "id": "fmt ",
    "size": 16,
    "type": 1,
    "channels": 1,
    "sampleRate": 8000,
    "byteRate": 8000,
    "blockAlignment": 1,
    "bitsPerSample": 8,
    "typeName": "PCM",
    "sampleSize": 1
  },
  "data": {
    "id": "data",
    "size": 4273,
    "start": 44,
    "sampleCount": 4265,
    "duration": 0.533125
  }
}
```

## Web Browser

```html
<script type="text/javascript">
  window.exports = {};
</script>
<script src="../lib/index.js" type="text/javascript"></script>
<form><input type="file" change="changeFile(this.files)" /></form>
<xmp id="riff"></xmp>
<script type="text/javascript">
  function changeFile(files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      var reader = new window.exports.RiffWaveReader(e.target.result);
      reader.readChunks().then(function(chunks) {
        riff.innerText = JSON.stringify(chunks, null, "  ");
      });
    };
    reader.readAsArrayBuffer(blob);
  }
</script>
```
