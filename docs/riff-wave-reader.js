"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.RiffWaveReader = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var errorRiffTag = "RIFF chunk has wrong tag.";
var errorRiffFormat = "RIFF chunk specifies invalid format";
var errorFormatId = "Format chunk id is invalid";
var unknown = "Unknown";
var errorDataId = "Data chunk id is invalid";

var RiffWaveReader =
/*#__PURE__*/
function () {
  function RiffWaveReader(reader) {
    _classCallCheck(this, RiffWaveReader);

    this.reader = reader;
  }

  _createClass(RiffWaveReader, [{
    key: "_read",
    value: function _read(offset, size) {
      var reader = this.reader;

      if (Array.isArray(reader)) {
        return new Promise(function (resolve) {
          return resolve(reader.slice(offset, offset + size + 1));
        });
      } else if (reader.constructor && reader.constructor.name === "ArrayBuffer") {
        return new Promise(function (resolve) {
          return resolve(new Int8Array(reader.slice(offset, offset + size + 1)));
        });
      }

      return reader.read(offset, size);
    }
  }, {
    key: "readSample",
    value: function readSample(channel, index) {
      var _this = this;

      return this.readChunks().then(function (_ref) {
        var format = _ref.format;
        var position = format.sampleStart + index * format.sampleSize + channel * format.bitsPerSample / 8;
        var size = format.bitsPerSample / 8;
        return _this._read(position, size).then(function (buffer) {
          return int8(buffer, 0);
        });
      });
    }
  }, {
    key: "readChunks",
    value: function readChunks() {
      var _this2 = this;

      if (this._chunks) {
        return new Promise(function (resolve) {
          return resolve(_this2._chunks);
        });
      }

      return this._read(0, 44).then(function (buffer) {
        // RIFF
        var tag = ascii(buffer, 0, 4);
        if (tag !== "RIFF") throw errorRiffTag;
        var riffSize = int32(buffer, 4);
        var format = ascii(buffer, 8, 4);
        if (format !== "WAVE") errorRiffFormat;
        var riffChunk = {
          tag: tag,
          size: riffSize,
          format: format
        }; // Format

        var id = ascii(buffer, 12, 4);
        if (id !== "fmt ") throw errorFormatId;
        var formatSize = int32(buffer, 16);
        var type = int16(buffer, 20);
        var channels = int16(buffer, 22);
        var sampleRate = int32(buffer, 24);
        var byteRate = int32(buffer, 28);
        var blockAlignment = int16(buffer, 32);
        var bitsPerSample = int16(buffer, 34); // Calculations

        var typeName = type === 1 ? "PCM" : unknown;
        var sampleSize = channels * bitsPerSample / 8;
        var tlvSize = 8;
        var riffChunkSize = tlvSize + 4;
        var formatChunkSize = tlvSize + formatSize;
        var dataChunkOffset = tlvSize;
        var sampleStart = riffChunkSize + formatChunkSize + dataChunkOffset;
        var rawDataSize = riffSize - sampleStart;
        var sampleCount = rawDataSize / (channels * bitsPerSample / 8);
        var duration = sampleCount / sampleRate;
        var formatChunk = {
          id: id,
          size: formatSize,
          type: type,
          channels: channels,
          sampleRate: sampleRate,
          byteRate: byteRate,
          blockAlignment: blockAlignment,
          bitsPerSample: bitsPerSample,
          typeName: typeName,
          sampleSize: sampleSize,
          sampleStart: sampleStart,
          sampleCount: sampleCount,
          duration: duration
        }; // Data

        var dataChunk;

        if (formatSize === 16) {
          dataChunk = {
            id: ascii(buffer, 36, 4),
            size: int32(buffer, 40),
            start: 44
          };
          if (dataChunk.id !== "data") throw errorDataId;
        }

        return _this2._chunks = {
          riff: riffChunk,
          format: formatChunk,
          data: dataChunk
        };
      });
    }
  }]);

  return RiffWaveReader;
}();

exports.RiffWaveReader = RiffWaveReader;
var _default = RiffWaveReader;
exports["default"] = _default;

var ascii = function ascii(source, position, length) {
  var value = "";

  for (var i = 0; i < length; i++) {
    value += String.fromCharCode(source[position + i]);
  }

  return value;
};

var int8 = function int8(source, position) {
  return littleEndian(source, position, 1);
};

var int16 = function int16(source, position) {
  return littleEndian(source, position, 2);
};

var int32 = function int32(source, position) {
  return littleEndian(source, position, 4);
};

var littleEndian = function littleEndian(source, position, length) {
  var value = 0;

  for (var i = length - 1; i >= 0; i--) {
    value *= 256;
    value += source[position + i];
  }

  return value;
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aWZmVGFnID0gXCJSSUZGIGNodW5rIGhhcyB3cm9uZyB0YWcuXCI7XHJcbmNvbnN0IGVycm9yUmlmZkZvcm1hdCA9IFwiUklGRiBjaHVuayBzcGVjaWZpZXMgaW52YWxpZCBmb3JtYXRcIjtcclxuY29uc3QgZXJyb3JGb3JtYXRJZCA9IFwiRm9ybWF0IGNodW5rIGlkIGlzIGludmFsaWRcIjtcclxuY29uc3QgdW5rbm93biA9IFwiVW5rbm93blwiO1xyXG5jb25zdCBlcnJvckRhdGFJZCA9IFwiRGF0YSBjaHVuayBpZCBpcyBpbnZhbGlkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmlmZldhdmVSZWFkZXIge1xyXG4gIGNvbnN0cnVjdG9yKHJlYWRlcikge1xyXG4gICAgdGhpcy5yZWFkZXIgPSByZWFkZXI7XHJcbiAgfVxyXG5cclxuICBfcmVhZChvZmZzZXQsIHNpemUpIHtcclxuICAgIGNvbnN0IHJlYWRlciA9IHRoaXMucmVhZGVyO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVhZGVyKSkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PlxyXG4gICAgICAgIHJlc29sdmUocmVhZGVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2l6ZSArIDEpKVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChcclxuICAgICAgcmVhZGVyLmNvbnN0cnVjdG9yICYmXHJcbiAgICAgIHJlYWRlci5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkFycmF5QnVmZmVyXCJcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PlxyXG4gICAgICAgIHJlc29sdmUobmV3IEludDhBcnJheShyZWFkZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzaXplICsgMSkpKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlYWRlci5yZWFkKG9mZnNldCwgc2l6ZSk7XHJcbiAgfVxyXG5cclxuICByZWFkU2FtcGxlKGNoYW5uZWwsIGluZGV4KSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkQ2h1bmtzKCkudGhlbigoeyBmb3JtYXQgfSkgPT4ge1xyXG4gICAgICBjb25zdCBwb3NpdGlvbiA9XHJcbiAgICAgICAgZm9ybWF0LnNhbXBsZVN0YXJ0ICtcclxuICAgICAgICBpbmRleCAqIGZvcm1hdC5zYW1wbGVTaXplICtcclxuICAgICAgICAoY2hhbm5lbCAqIGZvcm1hdC5iaXRzUGVyU2FtcGxlKSAvIDg7XHJcbiAgICAgIGNvbnN0IHNpemUgPSBmb3JtYXQuYml0c1BlclNhbXBsZSAvIDg7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZWFkKHBvc2l0aW9uLCBzaXplKS50aGVuKGJ1ZmZlciA9PiBpbnQ4KGJ1ZmZlciwgMCkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJlYWRDaHVua3MoKSB7XHJcbiAgICBpZiAodGhpcy5fY2h1bmtzKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmUodGhpcy5fY2h1bmtzKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fcmVhZCgwLCA0NCkudGhlbihidWZmZXIgPT4ge1xyXG4gICAgICAvLyBSSUZGXHJcbiAgICAgIGNvbnN0IHRhZyA9IGFzY2lpKGJ1ZmZlciwgMCwgNCk7XHJcbiAgICAgIGlmICh0YWcgIT09IFwiUklGRlwiKSB0aHJvdyBlcnJvclJpZmZUYWc7XHJcblxyXG4gICAgICBsZXQgcmlmZlNpemUgPSBpbnQzMihidWZmZXIsIDQpO1xyXG5cclxuICAgICAgY29uc3QgZm9ybWF0ID0gYXNjaWkoYnVmZmVyLCA4LCA0KTtcclxuICAgICAgaWYgKGZvcm1hdCAhPT0gXCJXQVZFXCIpIGVycm9yUmlmZkZvcm1hdDtcclxuXHJcbiAgICAgIGNvbnN0IHJpZmZDaHVuayA9IHsgdGFnLCBzaXplOiByaWZmU2l6ZSwgZm9ybWF0IH07XHJcblxyXG4gICAgICAvLyBGb3JtYXRcclxuICAgICAgY29uc3QgaWQgPSBhc2NpaShidWZmZXIsIDEyLCA0KTtcclxuICAgICAgaWYgKGlkICE9PSBcImZtdCBcIikgdGhyb3cgZXJyb3JGb3JtYXRJZDtcclxuICAgICAgY29uc3QgZm9ybWF0U2l6ZSA9IGludDMyKGJ1ZmZlciwgMTYpO1xyXG4gICAgICBjb25zdCB0eXBlID0gaW50MTYoYnVmZmVyLCAyMCk7XHJcbiAgICAgIGNvbnN0IGNoYW5uZWxzID0gaW50MTYoYnVmZmVyLCAyMik7XHJcbiAgICAgIGNvbnN0IHNhbXBsZVJhdGUgPSBpbnQzMihidWZmZXIsIDI0KTtcclxuICAgICAgY29uc3QgYnl0ZVJhdGUgPSBpbnQzMihidWZmZXIsIDI4KTtcclxuICAgICAgY29uc3QgYmxvY2tBbGlnbm1lbnQgPSBpbnQxNihidWZmZXIsIDMyKTtcclxuICAgICAgY29uc3QgYml0c1BlclNhbXBsZSA9IGludDE2KGJ1ZmZlciwgMzQpO1xyXG5cclxuICAgICAgLy8gQ2FsY3VsYXRpb25zXHJcbiAgICAgIGNvbnN0IHR5cGVOYW1lID0gdHlwZSA9PT0gMSA/IFwiUENNXCIgOiB1bmtub3duO1xyXG4gICAgICBjb25zdCBzYW1wbGVTaXplID0gKGNoYW5uZWxzICogYml0c1BlclNhbXBsZSkgLyA4O1xyXG5cclxuICAgICAgY29uc3QgdGx2U2l6ZSA9IDg7XHJcbiAgICAgIGNvbnN0IHJpZmZDaHVua1NpemUgPSB0bHZTaXplICsgNDtcclxuICAgICAgY29uc3QgZm9ybWF0Q2h1bmtTaXplID0gdGx2U2l6ZSArIGZvcm1hdFNpemU7XHJcbiAgICAgIGNvbnN0IGRhdGFDaHVua09mZnNldCA9IHRsdlNpemU7XHJcbiAgICAgIGNvbnN0IHNhbXBsZVN0YXJ0ID0gcmlmZkNodW5rU2l6ZSArIGZvcm1hdENodW5rU2l6ZSArIGRhdGFDaHVua09mZnNldDtcclxuXHJcbiAgICAgIGxldCByYXdEYXRhU2l6ZSA9IHJpZmZTaXplIC0gc2FtcGxlU3RhcnQ7XHJcbiAgICAgIGNvbnN0IHNhbXBsZUNvdW50ID0gcmF3RGF0YVNpemUgLyAoKGNoYW5uZWxzICogYml0c1BlclNhbXBsZSkgLyA4KTtcclxuICAgICAgY29uc3QgZHVyYXRpb24gPSBzYW1wbGVDb3VudCAvIHNhbXBsZVJhdGU7XHJcbiAgICAgIGNvbnN0IGZvcm1hdENodW5rID0ge1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIHNpemU6IGZvcm1hdFNpemUsXHJcbiAgICAgICAgdHlwZSxcclxuICAgICAgICBjaGFubmVscyxcclxuICAgICAgICBzYW1wbGVSYXRlLFxyXG4gICAgICAgIGJ5dGVSYXRlLFxyXG4gICAgICAgIGJsb2NrQWxpZ25tZW50LFxyXG4gICAgICAgIGJpdHNQZXJTYW1wbGUsXHJcbiAgICAgICAgdHlwZU5hbWUsXHJcbiAgICAgICAgc2FtcGxlU2l6ZSxcclxuICAgICAgICBzYW1wbGVTdGFydCxcclxuICAgICAgICBzYW1wbGVDb3VudCxcclxuICAgICAgICBkdXJhdGlvblxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gRGF0YVxyXG4gICAgICBsZXQgZGF0YUNodW5rO1xyXG4gICAgICBpZiAoZm9ybWF0U2l6ZSA9PT0gMTYpIHtcclxuICAgICAgICBkYXRhQ2h1bmsgPSB7XHJcbiAgICAgICAgICBpZDogYXNjaWkoYnVmZmVyLCAzNiwgNCksXHJcbiAgICAgICAgICBzaXplOiBpbnQzMihidWZmZXIsIDQwKSxcclxuICAgICAgICAgIHN0YXJ0OiA0NFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGRhdGFDaHVuay5pZCAhPT0gXCJkYXRhXCIpIHRocm93IGVycm9yRGF0YUlkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gKHRoaXMuX2NodW5rcyA9IHtcclxuICAgICAgICByaWZmOiByaWZmQ2h1bmssXHJcbiAgICAgICAgZm9ybWF0OiBmb3JtYXRDaHVuayxcclxuICAgICAgICBkYXRhOiBkYXRhQ2h1bmtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgUmlmZldhdmVSZWFkZXI7XHJcblxyXG5jb25zdCBhc2NpaSA9IChzb3VyY2UsIHBvc2l0aW9uLCBsZW5ndGgpID0+IHtcclxuICBsZXQgdmFsdWUgPSBcIlwiO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgIHZhbHVlICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoc291cmNlW3Bvc2l0aW9uICsgaV0pO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn07XHJcbmNvbnN0IGludDggPSAoc291cmNlLCBwb3NpdGlvbikgPT4gbGl0dGxlRW5kaWFuKHNvdXJjZSwgcG9zaXRpb24sIDEpO1xyXG5jb25zdCBpbnQxNiA9IChzb3VyY2UsIHBvc2l0aW9uKSA9PiBsaXR0bGVFbmRpYW4oc291cmNlLCBwb3NpdGlvbiwgMik7XHJcbmNvbnN0IGludDMyID0gKHNvdXJjZSwgcG9zaXRpb24pID0+IGxpdHRsZUVuZGlhbihzb3VyY2UsIHBvc2l0aW9uLCA0KTtcclxuY29uc3QgbGl0dGxlRW5kaWFuID0gKHNvdXJjZSwgcG9zaXRpb24sIGxlbmd0aCkgPT4ge1xyXG4gIGxldCB2YWx1ZSA9IDA7XHJcbiAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICB2YWx1ZSAqPSAwYjEwMDAwMDAwMDtcclxuICAgIHZhbHVlICs9IHNvdXJjZVtwb3NpdGlvbiArIGldO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn07XHJcbiJdfQ==