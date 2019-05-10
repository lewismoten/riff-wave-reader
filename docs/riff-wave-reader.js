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
          return uint8(buffer, 0);
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
        var sampleCount = (dataSize - tlvSize) / (channels * bitsPerSample / 8);
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

var int16 = function int16(source, position) {
  return littleEndian(source, position, 2);
};

var int32 = function int32(source, position) {
  return littleEndian(source, position, 4);
};

var littleEndianU = function littleEndianU(source, position, length) {
  return new Uint8Array(source, position, length)[0];
};

var littleEndian = function littleEndian(source, position, length) {
  var value = 0;

  for (var i = length - 1; i >= 0; i--) {
    value *= 256;
    value += source[position + i];
  }

  return value;
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFHLENBQXRCLEVBQXlCLENBQUMsSUFBSSxDQUE5QixFQUFpQyxDQUFDLEVBQWxDLEVBQXNDO0FBQ3BDLElBQUEsS0FBSyxJQUFJLEdBQVQ7QUFDQSxJQUFBLEtBQUssSUFBSSxNQUFNLENBQUMsUUFBUSxHQUFHLENBQVosQ0FBZjtBQUNEOztBQUNELFNBQU8sS0FBUDtBQUNELENBUEQiLCJmaWxlIjoicmlmZi13YXZlLXJlYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGVycm9yUmlmZlRhZyA9IFwiUklGRiBjaHVuayBoYXMgd3JvbmcgdGFnLlwiO1xyXG5jb25zdCBlcnJvclJpZmZGb3JtYXQgPSBcIlJJRkYgY2h1bmsgc3BlY2lmaWVzIGludmFsaWQgZm9ybWF0XCI7XHJcbmNvbnN0IGVycm9yRm9ybWF0SWQgPSBcIkZvcm1hdCBjaHVuayBpZCBpcyBpbnZhbGlkXCI7XHJcbmNvbnN0IHVua25vd24gPSBcIlVua25vd25cIjtcclxuY29uc3QgZXJyb3JEYXRhSWQgPSBcIkRhdGEgY2h1bmsgaWQgaXMgaW52YWxpZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJpZmZXYXZlUmVhZGVyIHtcclxuICBjb25zdHJ1Y3RvcihyZWFkZXIpIHtcclxuICAgIHRoaXMucmVhZGVyID0gcmVhZGVyO1xyXG4gIH1cclxuXHJcbiAgX3JlYWQob2Zmc2V0LCBzaXplKSB7XHJcbiAgICBjb25zdCByZWFkZXIgPSB0aGlzLnJlYWRlcjtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHJlYWRlcikpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cclxuICAgICAgICByZXNvbHZlKHJlYWRlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHNpemUgKyAxKSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgIHJlYWRlci5jb25zdHJ1Y3RvciAmJlxyXG4gICAgICByZWFkZXIuY29uc3RydWN0b3IubmFtZSA9PT0gXCJBcnJheUJ1ZmZlclwiXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cclxuICAgICAgICByZXNvbHZlKG5ldyBVaW50OEFycmF5KHJlYWRlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHNpemUgKyAxKSkpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVhZGVyLnJlYWQob2Zmc2V0LCBzaXplKTtcclxuICB9XHJcblxyXG4gIHJlYWRTYW1wbGUoY2hhbm5lbCwgaW5kZXgpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWRDaHVua3MoKS50aGVuKCh7IGZvcm1hdCwgZGF0YSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHBvc2l0aW9uID1cclxuICAgICAgICBkYXRhLnN0YXJ0ICtcclxuICAgICAgICBpbmRleCAqIGZvcm1hdC5zYW1wbGVTaXplICtcclxuICAgICAgICAoY2hhbm5lbCAqIGZvcm1hdC5iaXRzUGVyU2FtcGxlKSAvIDg7XHJcbiAgICAgIGNvbnN0IHNpemUgPSBmb3JtYXQuYml0c1BlclNhbXBsZSAvIDg7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZWFkKHBvc2l0aW9uLCBzaXplKS50aGVuKGJ1ZmZlciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHVpbnQ4KGJ1ZmZlciwgMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJlYWRDaHVua3MoKSB7XHJcbiAgICBpZiAodGhpcy5fY2h1bmtzKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmUodGhpcy5fY2h1bmtzKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fcmVhZCgwLCA0NCkudGhlbihidWZmZXIgPT4ge1xyXG4gICAgICAvLyBSSUZGXHJcbiAgICAgIGNvbnN0IHRhZyA9IGFzY2lpKGJ1ZmZlciwgMCwgNCk7XHJcbiAgICAgIGlmICh0YWcgIT09IFwiUklGRlwiKSB0aHJvdyBlcnJvclJpZmZUYWc7XHJcblxyXG4gICAgICBsZXQgcmlmZlNpemUgPSBpbnQzMihidWZmZXIsIDQpO1xyXG5cclxuICAgICAgY29uc3QgZm9ybWF0ID0gYXNjaWkoYnVmZmVyLCA4LCA0KTtcclxuICAgICAgaWYgKGZvcm1hdCAhPT0gXCJXQVZFXCIpIGVycm9yUmlmZkZvcm1hdDtcclxuXHJcbiAgICAgIGNvbnN0IHJpZmZDaHVuayA9IHsgdGFnLCBzaXplOiByaWZmU2l6ZSwgZm9ybWF0IH07XHJcblxyXG4gICAgICAvLyBGb3JtYXRcclxuICAgICAgY29uc3QgaWQgPSBhc2NpaShidWZmZXIsIDEyLCA0KTtcclxuICAgICAgaWYgKGlkICE9PSBcImZtdCBcIikgdGhyb3cgZXJyb3JGb3JtYXRJZDtcclxuICAgICAgY29uc3QgZm9ybWF0U2l6ZSA9IGludDMyKGJ1ZmZlciwgMTYpO1xyXG4gICAgICBjb25zdCB0eXBlID0gaW50MTYoYnVmZmVyLCAyMCk7XHJcbiAgICAgIGNvbnN0IGNoYW5uZWxzID0gaW50MTYoYnVmZmVyLCAyMik7XHJcbiAgICAgIGNvbnN0IHNhbXBsZVJhdGUgPSBpbnQzMihidWZmZXIsIDI0KTtcclxuICAgICAgY29uc3QgYnl0ZVJhdGUgPSBpbnQzMihidWZmZXIsIDI4KTtcclxuICAgICAgY29uc3QgYmxvY2tBbGlnbm1lbnQgPSBpbnQxNihidWZmZXIsIDMyKTtcclxuICAgICAgY29uc3QgYml0c1BlclNhbXBsZSA9IGludDE2KGJ1ZmZlciwgMzQpO1xyXG5cclxuICAgICAgLy8gQ2FsY3VsYXRpb25zXHJcbiAgICAgIGNvbnN0IHR5cGVOYW1lID0gdHlwZSA9PT0gMSA/IFwiUENNXCIgOiB1bmtub3duO1xyXG4gICAgICBjb25zdCBzYW1wbGVTaXplID0gKGNoYW5uZWxzICogYml0c1BlclNhbXBsZSkgLyA4O1xyXG5cclxuICAgICAgY29uc3QgdGFnU2l6ZSA9IDQ7XHJcbiAgICAgIGNvbnN0IGxlbmd0aFNpemUgPSA0O1xyXG4gICAgICBjb25zdCB0bHZTaXplID0gdGFnU2l6ZSArIGxlbmd0aFNpemU7XHJcbiAgICAgIGNvbnN0IHJpZmZDaHVua1NpemUgPSB0bHZTaXplICsgNDsgLy8gV0FWRVxyXG4gICAgICBjb25zdCBmb3JtYXRDaHVua1NpemUgPSB0bHZTaXplICsgZm9ybWF0U2l6ZTtcclxuICAgICAgY29uc3QgZGF0YUNodW5rU3RhcnQgPSByaWZmQ2h1bmtTaXplICsgZm9ybWF0Q2h1bmtTaXplO1xyXG5cclxuICAgICAgY29uc3QgZm9ybWF0Q2h1bmsgPSB7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgc2l6ZTogZm9ybWF0U2l6ZSxcclxuICAgICAgICB0eXBlLFxyXG4gICAgICAgIGNoYW5uZWxzLFxyXG4gICAgICAgIHNhbXBsZVJhdGUsXHJcbiAgICAgICAgYnl0ZVJhdGUsXHJcbiAgICAgICAgYmxvY2tBbGlnbm1lbnQsXHJcbiAgICAgICAgYml0c1BlclNhbXBsZSxcclxuICAgICAgICB0eXBlTmFtZSxcclxuICAgICAgICBzYW1wbGVTaXplXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBEYXRhXHJcbiAgICAgIGxldCBkYXRhQ2h1bms7XHJcbiAgICAgIGNvbnN0IGRhdGFJZCA9IGFzY2lpKGJ1ZmZlciwgZGF0YUNodW5rU3RhcnQsIHRhZ1NpemUpO1xyXG4gICAgICBpZiAoZGF0YUlkICE9PSBcImRhdGFcIikgdGhyb3cgZXJyb3JEYXRhSWQ7XHJcbiAgICAgIGNvbnN0IGRhdGFTaXplID0gaW50MzIoYnVmZmVyLCBkYXRhQ2h1bmtTdGFydCArIHRhZ1NpemUpO1xyXG4gICAgICBjb25zdCBzYW1wbGVTdGFydCA9IGRhdGFDaHVua1N0YXJ0ICsgdGx2U2l6ZTtcclxuICAgICAgY29uc3Qgc2FtcGxlQ291bnQgPVxyXG4gICAgICAgIChkYXRhU2l6ZSAtIHRsdlNpemUpIC8gKChjaGFubmVscyAqIGJpdHNQZXJTYW1wbGUpIC8gOCk7XHJcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gc2FtcGxlQ291bnQgLyBzYW1wbGVSYXRlO1xyXG4gICAgICBkYXRhQ2h1bmsgPSB7XHJcbiAgICAgICAgaWQ6IGRhdGFJZCxcclxuICAgICAgICBzaXplOiBkYXRhU2l6ZSxcclxuICAgICAgICBzdGFydDogc2FtcGxlU3RhcnQsXHJcbiAgICAgICAgc2FtcGxlQ291bnQsXHJcbiAgICAgICAgZHVyYXRpb25cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiAodGhpcy5fY2h1bmtzID0ge1xyXG4gICAgICAgIHJpZmY6IHJpZmZDaHVuayxcclxuICAgICAgICBmb3JtYXQ6IGZvcm1hdENodW5rLFxyXG4gICAgICAgIGRhdGE6IGRhdGFDaHVua1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBSaWZmV2F2ZVJlYWRlcjtcclxuXHJcbmNvbnN0IGFzY2lpID0gKHNvdXJjZSwgcG9zaXRpb24sIGxlbmd0aCkgPT4ge1xyXG4gIGxldCB2YWx1ZSA9IFwiXCI7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgdmFsdWUgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShzb3VyY2VbcG9zaXRpb24gKyBpXSk7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuY29uc3QgdWludDggPSAoc291cmNlLCBwb3NpdGlvbikgPT4gbGl0dGxlRW5kaWFuVShzb3VyY2UsIHBvc2l0aW9uLCAxKTtcclxuY29uc3QgaW50MTYgPSAoc291cmNlLCBwb3NpdGlvbikgPT4gbGl0dGxlRW5kaWFuKHNvdXJjZSwgcG9zaXRpb24sIDIpO1xyXG5jb25zdCBpbnQzMiA9IChzb3VyY2UsIHBvc2l0aW9uKSA9PiBsaXR0bGVFbmRpYW4oc291cmNlLCBwb3NpdGlvbiwgNCk7XHJcbmNvbnN0IGxpdHRsZUVuZGlhblUgPSAoc291cmNlLCBwb3NpdGlvbiwgbGVuZ3RoKSA9PiB7XHJcbiAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHNvdXJjZSwgcG9zaXRpb24sIGxlbmd0aClbMF07XHJcbn07XHJcbmNvbnN0IGxpdHRsZUVuZGlhbiA9IChzb3VyY2UsIHBvc2l0aW9uLCBsZW5ndGgpID0+IHtcclxuICBsZXQgdmFsdWUgPSAwO1xyXG4gIGZvciAobGV0IGkgPSBsZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgdmFsdWUgKj0gMGIxMDAwMDAwMDA7XHJcbiAgICB2YWx1ZSArPSBzb3VyY2VbcG9zaXRpb24gKyBpXTtcclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlO1xyXG59O1xyXG4iXX0=