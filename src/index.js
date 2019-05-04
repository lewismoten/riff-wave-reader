import { readRiffHeader } from "./read-riff--header.js";
import { readFormatHeader } from "./read-format-header.js";
import { readDataHeader } from "./read-data-header.js";
import { readSample } from "./read-sample.js";

export class Reader {
  constructor(file) {
    this.file = file;
  }
  readRiff() {
    return readRiffHeader(this);
  }

  readFormat() {
    return readFormatHeader(this);
  }
  readDataHeader() {
    return readDataHeader(this);
  }
  readSample(channel, index) {
    return readSample(this, channel, index);
  }
  readChunks() {
    return readRiffHeader(this).then(riff => {
      return readFormatHeader(this).then(format => {
        return readDataHeader(this).then(data => {
          return {
            riff,
            format,
            data
          };
        });
      });
    });
  }
}
export default Reader;
