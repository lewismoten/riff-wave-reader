(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["riff-wave-reader"] = factory();
	else
		root["riff-wave-reader"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/converter.js":
/*!**************************!*\
  !*** ./src/converter.js ***!
  \**************************/
/*! exports provided: ascii, uint8, uint16, int16, uint32, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ascii\", function() { return ascii; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uint8\", function() { return uint8; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uint16\", function() { return uint16; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"int16\", function() { return int16; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uint32\", function() { return uint32; });\nconst ascii = (source, position, length) => {\n  let value = \"\";\n  for (let i = 0; i < length; i++) {\n    value += String.fromCharCode(source[position + i]);\n  }\n  return value;\n};\nconst uint8 = (source, position) => littleEndianU(source, position, 1);\nconst uint16 = (source, position) => littleEndianU(source, position, 2);\nconst int16 = (source, position) => littleEndian(source, position, 2);\nconst uint32 = (source, position) => littleEndianU(source, position, 4);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  ascii,\n  uint8,\n  uint16,\n  int16,\n  uint32\n});\n\nconst littleEndian = (source, position, length) => {\n  let value = littleEndianU(source, position, length);\n  const max = Math.pow(2, length * 8);\n  if (value > max / 2 - 1) {\n      value -= max\n  }\n  return value;\n}\n\nconst littleEndianU = (source, position, length) => {\n  let value = 0;\n  for (let i = length - 1; i >= 0; i--) {\n    value *= 0b100000000;\n    value += source[position + i];\n  }\n  return value;\n};\n\n\n//# sourceURL=webpack://riff-wave-reader/./src/converter.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: RiffWaveReader, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RiffWaveReader\", function() { return RiffWaveReader; });\n/* harmony import */ var _converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./converter */ \"./src/converter.js\");\n\n\nconst errorRiffTag = \"RIFF chunk has wrong tag.\";\nconst errorRiffFormat = \"RIFF chunk specifies invalid format\";\nconst errorFormatId = \"Format chunk id is invalid\";\nconst unknown = \"Unknown\";\nconst errorDataId = \"Data chunk id is invalid\";\n\nclass RiffWaveReader {\n  constructor(reader) {\n    this.reader = reader;\n  }\n\n  _read(offset, size) {\n    const reader = this.reader;\n    if (Array.isArray(reader)) {\n      return new Promise(resolve =>\n        resolve(reader.slice(offset, offset + size + 1))\n      );\n    } else if (\n      reader.constructor &&\n      reader.constructor.name === \"ArrayBuffer\"\n    ) {\n      return new Promise(resolve =>\n        resolve(new Uint8Array(reader.slice(offset, offset + size + 1)))\n      );\n    }\n    return reader.read(offset, size);\n  }\n\n  readSample(channel, index) {\n    return this.readChunks().then(({ format, data }) => {\n      const position =\n        data.start +\n        index * format.sampleSize +\n        (channel * format.bitsPerSample) / 8;\n      const size = format.bitsPerSample / 8;\n      return this._read(position, size).then(buffer => {\n        switch(size) {\n          default:\n          case 1:return Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint8\"])(buffer, 0);\n          case 2: return Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"int16\"])(buffer, 0);\n        }\n\n      });\n    });\n  }\n  readChunks() {\n    if (this._chunks) {\n      return new Promise(resolve => resolve(this._chunks));\n    }\n    return this._read(0, 44).then(buffer => {\n      // RIFF\n      const tag = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"ascii\"])(buffer, 0, 4);\n      if (tag !== \"RIFF\") throw errorRiffTag;\n\n      let riffSize = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, 4);\n\n      const format = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"ascii\"])(buffer, 8, 4);\n      if (format !== \"WAVE\") errorRiffFormat;\n\n      const riffChunk = { tag, size: riffSize, format };\n\n      // Format\n      const id = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"ascii\"])(buffer, 12, 4);\n      if (id !== \"fmt \") throw errorFormatId;\n      const formatSize = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, 16);\n      const type = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint16\"])(buffer, 20);\n      const channels = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint16\"])(buffer, 22);\n      const sampleRate = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, 24);\n      const byteRate = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, 28);\n      const blockAlignment = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint16\"])(buffer, 32);\n      const bitsPerSample = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint16\"])(buffer, 34);\n\n      // Calculations\n      const typeName = type === 1 ? \"PCM\" : unknown;\n      const sampleSize = (channels * bitsPerSample) / 8;\n\n      const tagSize = 4;\n      const lengthSize = 4;\n      const tlvSize = tagSize + lengthSize;\n      const riffChunkSize = tlvSize + 4; // WAVE\n      const formatChunkSize = tlvSize + formatSize;\n      const dataChunkStart = riffChunkSize + formatChunkSize;\n\n      const formatChunk = {\n        id,\n        size: formatSize,\n        type,\n        channels,\n        sampleRate,\n        byteRate,\n        blockAlignment,\n        bitsPerSample,\n        typeName,\n        sampleSize\n      };\n\n      // Data\n      let dataChunk;\n      const dataId = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"ascii\"])(buffer, dataChunkStart, tagSize);\n      if (dataId !== \"data\") throw errorDataId;\n      const dataSize = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, dataChunkStart + tagSize);\n      const sampleStart = dataChunkStart + tlvSize;\n      const sampleCount = dataSize / blockAlignment;\n      const duration = sampleCount / sampleRate;\n      dataChunk = {\n        id: dataId,\n        size: dataSize,\n        start: sampleStart,\n        sampleCount,\n        duration\n      };\n\n      return (this._chunks = {\n        riff: riffChunk,\n        format: formatChunk,\n        data: dataChunk\n      });\n    });\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (RiffWaveReader);\n\n\n//# sourceURL=webpack://riff-wave-reader/./src/index.js?");

/***/ })

/******/ });
});