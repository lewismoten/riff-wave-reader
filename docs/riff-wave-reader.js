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
          return resolve(new Uint8Array(reader.slice(offset, offset + size + 1)));
        });
      }

      return reader.read(offset, size);
    }
  }, {
    key: "readSample",
    value: function readSample(channel, index) {
      var _this = this;

      return this.readChunks().then(function (_ref) {
        var format = _ref.format,
            data = _ref.data;
        var position = data.start + index * format.sampleSize + channel * format.bitsPerSample / 8;
        var size = format.bitsPerSample / 8;
        return _this._read(position, size).then(function (buffer) {
          switch (size) {
            default:
            case 1:
              return uint8(buffer, 0);

            case 2:
              return int16(buffer, 0);
          }
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
        var type = uint16(buffer, 20);
        var channels = uint16(buffer, 22);
        var sampleRate = int32(buffer, 24);
        var byteRate = int32(buffer, 28);
        var blockAlignment = uint16(buffer, 32);
        var bitsPerSample = uint16(buffer, 34); // Calculations

        var typeName = type === 1 ? "PCM" : unknown;
        var sampleSize = channels * bitsPerSample / 8;
        var tagSize = 4;
        var lengthSize = 4;
        var tlvSize = tagSize + lengthSize;
        var riffChunkSize = tlvSize + 4; // WAVE

        var formatChunkSize = tlvSize + formatSize;
        var dataChunkStart = riffChunkSize + formatChunkSize;
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
          sampleSize: sampleSize
        }; // Data

        var dataChunk;
        var dataId = ascii(buffer, dataChunkStart, tagSize);
        if (dataId !== "data") throw errorDataId;
        var dataSize = int32(buffer, dataChunkStart + tagSize);
        var sampleStart = dataChunkStart + tlvSize;
        var sampleCount = dataSize / blockAlignment;
        var duration = sampleCount / sampleRate;
        dataChunk = {
          id: dataId,
          size: dataSize,
          start: sampleStart,
          sampleCount: sampleCount,
          duration: duration
        };
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

var uint8 = function uint8(source, position) {
  return littleEndianU(source, position, 1);
};

var uint16 = function uint16(source, position) {
  return littleEndianU(source, position, 2);
};

var int16 = function int16(source, position) {
  return littleEndian(source, position, 2);
};

var int32 = function int32(source, position) {
  return littleEndianU(source, position, 4);
};

var littleEndian = function littleEndian(source, position, length) {
  var value = source[length - 1];

  for (var i = length - 2; i >= 0; i--) {
    value <<= 8;
    value |= source[position + i];
  }

  if (length === 2) {
    value |= 0xffff0000;
  }

  return value;
};

var littleEndianU = function littleEndianU(source, position, length) {
  var value = 0;

  for (var i = length - 1; i >= 0; i--) {
    value *= 256;
    value += source[position + i];
  }

  return value;
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsQ0FBVixDQUFsQjs7QUFDQSxPQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUF0QixFQUF5QixDQUFDLElBQUksQ0FBOUIsRUFBaUMsQ0FBQyxFQUFsQyxFQUFzQztBQUNwQyxJQUFBLEtBQUssS0FBSyxDQUFWO0FBQ0EsSUFBQSxLQUFLLElBQUksTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFaLENBQWY7QUFDRDs7QUFDRCxNQUFJLE1BQU0sS0FBSyxDQUFmLEVBQWtCO0FBQ2hCLElBQUEsS0FBSyxJQUFJLFVBQVQ7QUFDRDs7QUFDRCxTQUFPLEtBQVA7QUFDRCxDQVZEOztBQVlBLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWdCLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsTUFBbkIsRUFBOEI7QUFDbEQsTUFBSSxLQUFLLEdBQUcsQ0FBWjs7QUFDQSxPQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUF0QixFQUF5QixDQUFDLElBQUksQ0FBOUIsRUFBaUMsQ0FBQyxFQUFsQyxFQUFzQztBQUNwQyxJQUFBLEtBQUssSUFBSSxHQUFUO0FBQ0EsSUFBQSxLQUFLLElBQUksTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFaLENBQWY7QUFDRDs7QUFDRCxTQUFPLEtBQVA7QUFDRCxDQVBEIiwiZmlsZSI6InJpZmYtd2F2ZS1yZWFkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBlcnJvclJpZmZUYWcgPSBcIlJJRkYgY2h1bmsgaGFzIHdyb25nIHRhZy5cIjtcclxuY29uc3QgZXJyb3JSaWZmRm9ybWF0ID0gXCJSSUZGIGNodW5rIHNwZWNpZmllcyBpbnZhbGlkIGZvcm1hdFwiO1xyXG5jb25zdCBlcnJvckZvcm1hdElkID0gXCJGb3JtYXQgY2h1bmsgaWQgaXMgaW52YWxpZFwiO1xyXG5jb25zdCB1bmtub3duID0gXCJVbmtub3duXCI7XHJcbmNvbnN0IGVycm9yRGF0YUlkID0gXCJEYXRhIGNodW5rIGlkIGlzIGludmFsaWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSaWZmV2F2ZVJlYWRlciB7XHJcbiAgY29uc3RydWN0b3IocmVhZGVyKSB7XHJcbiAgICB0aGlzLnJlYWRlciA9IHJlYWRlcjtcclxuICB9XHJcblxyXG4gIF9yZWFkKG9mZnNldCwgc2l6ZSkge1xyXG4gICAgY29uc3QgcmVhZGVyID0gdGhpcy5yZWFkZXI7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZWFkZXIpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+XHJcbiAgICAgICAgcmVzb2x2ZShyZWFkZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzaXplICsgMSkpXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKFxyXG4gICAgICByZWFkZXIuY29uc3RydWN0b3IgJiZcclxuICAgICAgcmVhZGVyLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiQXJyYXlCdWZmZXJcIlxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+XHJcbiAgICAgICAgcmVzb2x2ZShuZXcgVWludDhBcnJheShyZWFkZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzaXplICsgMSkpKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlYWRlci5yZWFkKG9mZnNldCwgc2l6ZSk7XHJcbiAgfVxyXG5cclxuICByZWFkU2FtcGxlKGNoYW5uZWwsIGluZGV4KSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkQ2h1bmtzKCkudGhlbigoeyBmb3JtYXQsIGRhdGEgfSkgPT4ge1xyXG4gICAgICBjb25zdCBwb3NpdGlvbiA9XHJcbiAgICAgICAgZGF0YS5zdGFydCArXHJcbiAgICAgICAgaW5kZXggKiBmb3JtYXQuc2FtcGxlU2l6ZSArXHJcbiAgICAgICAgKGNoYW5uZWwgKiBmb3JtYXQuYml0c1BlclNhbXBsZSkgLyA4O1xyXG4gICAgICBjb25zdCBzaXplID0gZm9ybWF0LmJpdHNQZXJTYW1wbGUgLyA4O1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVhZChwb3NpdGlvbiwgc2l6ZSkudGhlbihidWZmZXIgPT4ge1xyXG4gICAgICAgIHN3aXRjaChzaXplKSB7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY2FzZSAxOnJldHVybiB1aW50OChidWZmZXIsIDApO1xyXG4gICAgICAgICAgY2FzZSAyOiByZXR1cm4gaW50MTYoYnVmZmVyLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICByZWFkQ2h1bmtzKCkge1xyXG4gICAgaWYgKHRoaXMuX2NodW5rcykge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlKHRoaXMuX2NodW5rcykpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX3JlYWQoMCwgNDQpLnRoZW4oYnVmZmVyID0+IHtcclxuICAgICAgLy8gUklGRlxyXG4gICAgICBjb25zdCB0YWcgPSBhc2NpaShidWZmZXIsIDAsIDQpO1xyXG4gICAgICBpZiAodGFnICE9PSBcIlJJRkZcIikgdGhyb3cgZXJyb3JSaWZmVGFnO1xyXG5cclxuICAgICAgbGV0IHJpZmZTaXplID0gaW50MzIoYnVmZmVyLCA0KTtcclxuXHJcbiAgICAgIGNvbnN0IGZvcm1hdCA9IGFzY2lpKGJ1ZmZlciwgOCwgNCk7XHJcbiAgICAgIGlmIChmb3JtYXQgIT09IFwiV0FWRVwiKSBlcnJvclJpZmZGb3JtYXQ7XHJcblxyXG4gICAgICBjb25zdCByaWZmQ2h1bmsgPSB7IHRhZywgc2l6ZTogcmlmZlNpemUsIGZvcm1hdCB9O1xyXG5cclxuICAgICAgLy8gRm9ybWF0XHJcbiAgICAgIGNvbnN0IGlkID0gYXNjaWkoYnVmZmVyLCAxMiwgNCk7XHJcbiAgICAgIGlmIChpZCAhPT0gXCJmbXQgXCIpIHRocm93IGVycm9yRm9ybWF0SWQ7XHJcbiAgICAgIGNvbnN0IGZvcm1hdFNpemUgPSBpbnQzMihidWZmZXIsIDE2KTtcclxuICAgICAgY29uc3QgdHlwZSA9IHVpbnQxNihidWZmZXIsIDIwKTtcclxuICAgICAgY29uc3QgY2hhbm5lbHMgPSB1aW50MTYoYnVmZmVyLCAyMik7XHJcbiAgICAgIGNvbnN0IHNhbXBsZVJhdGUgPSBpbnQzMihidWZmZXIsIDI0KTtcclxuICAgICAgY29uc3QgYnl0ZVJhdGUgPSBpbnQzMihidWZmZXIsIDI4KTtcclxuICAgICAgY29uc3QgYmxvY2tBbGlnbm1lbnQgPSB1aW50MTYoYnVmZmVyLCAzMik7XHJcbiAgICAgIGNvbnN0IGJpdHNQZXJTYW1wbGUgPSB1aW50MTYoYnVmZmVyLCAzNCk7XHJcblxyXG4gICAgICAvLyBDYWxjdWxhdGlvbnNcclxuICAgICAgY29uc3QgdHlwZU5hbWUgPSB0eXBlID09PSAxID8gXCJQQ01cIiA6IHVua25vd247XHJcbiAgICAgIGNvbnN0IHNhbXBsZVNpemUgPSAoY2hhbm5lbHMgKiBiaXRzUGVyU2FtcGxlKSAvIDg7XHJcblxyXG4gICAgICBjb25zdCB0YWdTaXplID0gNDtcclxuICAgICAgY29uc3QgbGVuZ3RoU2l6ZSA9IDQ7XHJcbiAgICAgIGNvbnN0IHRsdlNpemUgPSB0YWdTaXplICsgbGVuZ3RoU2l6ZTtcclxuICAgICAgY29uc3QgcmlmZkNodW5rU2l6ZSA9IHRsdlNpemUgKyA0OyAvLyBXQVZFXHJcbiAgICAgIGNvbnN0IGZvcm1hdENodW5rU2l6ZSA9IHRsdlNpemUgKyBmb3JtYXRTaXplO1xyXG4gICAgICBjb25zdCBkYXRhQ2h1bmtTdGFydCA9IHJpZmZDaHVua1NpemUgKyBmb3JtYXRDaHVua1NpemU7XHJcblxyXG4gICAgICBjb25zdCBmb3JtYXRDaHVuayA9IHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBzaXplOiBmb3JtYXRTaXplLFxyXG4gICAgICAgIHR5cGUsXHJcbiAgICAgICAgY2hhbm5lbHMsXHJcbiAgICAgICAgc2FtcGxlUmF0ZSxcclxuICAgICAgICBieXRlUmF0ZSxcclxuICAgICAgICBibG9ja0FsaWdubWVudCxcclxuICAgICAgICBiaXRzUGVyU2FtcGxlLFxyXG4gICAgICAgIHR5cGVOYW1lLFxyXG4gICAgICAgIHNhbXBsZVNpemVcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIERhdGFcclxuICAgICAgbGV0IGRhdGFDaHVuaztcclxuICAgICAgY29uc3QgZGF0YUlkID0gYXNjaWkoYnVmZmVyLCBkYXRhQ2h1bmtTdGFydCwgdGFnU2l6ZSk7XHJcbiAgICAgIGlmIChkYXRhSWQgIT09IFwiZGF0YVwiKSB0aHJvdyBlcnJvckRhdGFJZDtcclxuICAgICAgY29uc3QgZGF0YVNpemUgPSBpbnQzMihidWZmZXIsIGRhdGFDaHVua1N0YXJ0ICsgdGFnU2l6ZSk7XHJcbiAgICAgIGNvbnN0IHNhbXBsZVN0YXJ0ID0gZGF0YUNodW5rU3RhcnQgKyB0bHZTaXplO1xyXG4gICAgICBjb25zdCBzYW1wbGVDb3VudCA9IGRhdGFTaXplIC8gYmxvY2tBbGlnbm1lbnQ7XHJcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gc2FtcGxlQ291bnQgLyBzYW1wbGVSYXRlO1xyXG4gICAgICBkYXRhQ2h1bmsgPSB7XHJcbiAgICAgICAgaWQ6IGRhdGFJZCxcclxuICAgICAgICBzaXplOiBkYXRhU2l6ZSxcclxuICAgICAgICBzdGFydDogc2FtcGxlU3RhcnQsXHJcbiAgICAgICAgc2FtcGxlQ291bnQsXHJcbiAgICAgICAgZHVyYXRpb25cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiAodGhpcy5fY2h1bmtzID0ge1xyXG4gICAgICAgIHJpZmY6IHJpZmZDaHVuayxcclxuICAgICAgICBmb3JtYXQ6IGZvcm1hdENodW5rLFxyXG4gICAgICAgIGRhdGE6IGRhdGFDaHVua1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBSaWZmV2F2ZVJlYWRlcjtcclxuXHJcbmNvbnN0IGFzY2lpID0gKHNvdXJjZSwgcG9zaXRpb24sIGxlbmd0aCkgPT4ge1xyXG4gIGxldCB2YWx1ZSA9IFwiXCI7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgdmFsdWUgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShzb3VyY2VbcG9zaXRpb24gKyBpXSk7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuY29uc3QgdWludDggPSAoc291cmNlLCBwb3NpdGlvbikgPT4gbGl0dGxlRW5kaWFuVShzb3VyY2UsIHBvc2l0aW9uLCAxKTtcclxuY29uc3QgdWludDE2ID0gKHNvdXJjZSwgcG9zaXRpb24pID0+IGxpdHRsZUVuZGlhblUoc291cmNlLCBwb3NpdGlvbiwgMik7XHJcbmNvbnN0IGludDE2ID0gKHNvdXJjZSwgcG9zaXRpb24pID0+IGxpdHRsZUVuZGlhbihzb3VyY2UsIHBvc2l0aW9uLCAyKTtcclxuY29uc3QgaW50MzIgPSAoc291cmNlLCBwb3NpdGlvbikgPT4gbGl0dGxlRW5kaWFuVShzb3VyY2UsIHBvc2l0aW9uLCA0KTtcclxuXHJcbmNvbnN0IGxpdHRsZUVuZGlhbiA9IChzb3VyY2UsIHBvc2l0aW9uLCBsZW5ndGgpID0+IHtcclxuICBsZXQgdmFsdWUgPSBzb3VyY2VbbGVuZ3RoIC0gMV07XHJcbiAgZm9yIChsZXQgaSA9IGxlbmd0aCAtIDI7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICB2YWx1ZSA8PD0gODtcclxuICAgIHZhbHVlIHw9IHNvdXJjZVtwb3NpdGlvbiArIGldO1xyXG4gIH1cclxuICBpZiAobGVuZ3RoID09PSAyKSB7XHJcbiAgICB2YWx1ZSB8PSAweGZmZmYwMDAwO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmNvbnN0IGxpdHRsZUVuZGlhblUgPSAoc291cmNlLCBwb3NpdGlvbiwgbGVuZ3RoKSA9PiB7XHJcbiAgbGV0IHZhbHVlID0gMDtcclxuICBmb3IgKGxldCBpID0gbGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgIHZhbHVlICo9IDBiMTAwMDAwMDAwO1xyXG4gICAgdmFsdWUgKz0gc291cmNlW3Bvc2l0aW9uICsgaV07XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuIl19