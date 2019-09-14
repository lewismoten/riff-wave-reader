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
/*! exports provided: ascii, uint8, uint16, int16, uint32, int24, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ascii\", function() { return ascii; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uint8\", function() { return uint8; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uint16\", function() { return uint16; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"int16\", function() { return int16; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uint32\", function() { return uint32; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"int24\", function() { return int24; });\nconst ascii = (source, position, length) => {\r\n  let value = \"\";\r\n  for (let i = 0; i < length; i++) {\r\n    value += String.fromCharCode(source[position + i]);\r\n  }\r\n  return value;\r\n};\r\nconst uint8 = (source, position) => littleEndianU(source, position, 1);\r\nconst uint16 = (source, position) => littleEndianU(source, position, 2);\r\nconst int16 = (source, position) => littleEndian(source, position, 2);\r\nconst uint32 = (source, position) => littleEndianU(source, position, 4);\r\nconst int24 = (source, position) => littleEndian(source, position, 3);\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\r\n  ascii,\r\n  uint8,\r\n  uint16,\r\n  int16,\r\n  uint32,\r\n  int24\r\n});\r\n\r\nconst littleEndian = (source, position, length) => {\r\n  let value = littleEndianU(source, position, length);\r\n  const max = Math.pow(2, length * 8);\r\n  if (value > max / 2 - 1) {\r\n      value -= max\r\n  }\r\n  return value;\r\n}\r\n\r\nconst littleEndianU = (source, position, length) => {\r\n  let value = 0;\r\n  for (let i = length - 1; i >= 0; i--) {\r\n    value *= 0b100000000;\r\n    value += source[position + i];\r\n  }\r\n  return value;\r\n};\r\n\n\n//# sourceURL=webpack://riff-wave-reader/./src/converter.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: RiffWaveReader, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RiffWaveReader\", function() { return RiffWaveReader; });\n/* harmony import */ var _converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./converter */ \"./src/converter.js\");\n\r\n\r\nconst errorRiffTag = \"RIFF chunk has wrong tag.\";\r\nconst errorRiffFormat = \"RIFF chunk specifies invalid format\";\r\nconst errorFormatId = \"Format chunk id is invalid\";\r\nconst unknown = \"Unknown\";\r\nconst errorDataId = \"Data chunk id is invalid\";\r\n\r\nclass RiffWaveReader {\r\n  constructor(reader) {\r\n    this.reader = reader;\r\n  }\r\n\r\n  _read(offset, size) {\r\n    const reader = this.reader;\r\n    if (Array.isArray(reader)) {\r\n      return new Promise(resolve =>\r\n        resolve(reader.slice(offset, offset + size + 1))\r\n      );\r\n    } else if (\r\n      reader.constructor &&\r\n      reader.constructor.name === \"ArrayBuffer\"\r\n    ) {\r\n      return new Promise(resolve =>\r\n        resolve(new Uint8Array(reader.slice(offset, offset + size + 1)))\r\n      );\r\n    }\r\n    return reader.read(offset, size);\r\n  }\r\n\r\n  readSample(channel, index) {\r\n    return this.readChunks().then(({ format: {sampleSize, bitsPerSample}, data }) => {\r\n      const position =\r\n        data.start +\r\n        index * sampleSize +\r\n        (channel * bitsPerSample) / 8;\r\n      const size = bitsPerSample / 8;\r\n      return this._read(position, size).then(buffer => {\r\n        switch(size) {\r\n          default:\r\n          case 1:return Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint8\"])(buffer, 0);\r\n          case 2: return Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"int16\"])(buffer, 0);\r\n          case 3: return Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"int24\"])(buffer, 0);\r\n        }\r\n\r\n      });\r\n    });\r\n  }\r\n  readChunks() {\r\n    if (this._chunks) {\r\n      return new Promise(resolve => resolve(this._chunks));\r\n    }\r\n    return this._read(0, 44).then(buffer => {\r\n      // RIFF\r\n      const tag = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"ascii\"])(buffer, 0, 4);\r\n      if (tag !== \"RIFF\") throw errorRiffTag;\r\n\r\n      let riffSize = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, 4);\r\n\r\n      const format = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"ascii\"])(buffer, 8, 4);\r\n      if (format !== \"WAVE\") errorRiffFormat;\r\n\r\n      const riffChunk = { tag, size: riffSize, format };\r\n\r\n      // Format\r\n      const id = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"ascii\"])(buffer, 12, 4);\r\n      if (id !== \"fmt \") throw errorFormatId;\r\n      const formatSize = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, 16);\r\n      const type = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint16\"])(buffer, 20);\r\n      const channels = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint16\"])(buffer, 22);\r\n      const sampleRate = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, 24);\r\n      const byteRate = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, 28);\r\n      const blockAlignment = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint16\"])(buffer, 32);\r\n      const bitsPerSample = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint16\"])(buffer, 34);\r\n\r\n      // Calculations\r\n      const typeName = type === 1 ? \"PCM\" : unknown;\r\n      const sampleSize = (channels * bitsPerSample) / 8;\r\n\r\n      const tagSize = 4;\r\n      const lengthSize = 4;\r\n      const tlvSize = tagSize + lengthSize;\r\n      const riffChunkSize = tlvSize + 4; // WAVE\r\n      const formatChunkSize = tlvSize + formatSize;\r\n      const dataChunkStart = riffChunkSize + formatChunkSize;\r\n\r\n      const formatChunk = {\r\n        id,\r\n        size: formatSize,\r\n        type,\r\n        channels,\r\n        sampleRate,\r\n        byteRate,\r\n        blockAlignment,\r\n        bitsPerSample,\r\n        typeName,\r\n        sampleSize\r\n      };\r\n\r\n      // Data\r\n      let dataChunk;\r\n      const dataId = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"ascii\"])(buffer, dataChunkStart, tagSize);\r\n      if (dataId !== \"data\") throw errorDataId;\r\n      const dataSize = Object(_converter__WEBPACK_IMPORTED_MODULE_0__[\"uint32\"])(buffer, dataChunkStart + tagSize);\r\n      const sampleStart = dataChunkStart + tlvSize;\r\n      const sampleCount = dataSize / blockAlignment;\r\n      const duration = sampleCount / sampleRate;\r\n      dataChunk = {\r\n        id: dataId,\r\n        size: dataSize,\r\n        start: sampleStart,\r\n        sampleCount,\r\n        duration\r\n      };\r\n\r\n      return (this._chunks = {\r\n        riff: riffChunk,\r\n        format: formatChunk,\r\n        data: dataChunk\r\n      });\r\n    });\r\n  }\r\n}\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (RiffWaveReader);\r\n\n\n//# sourceURL=webpack://riff-wave-reader/./src/index.js?");

/***/ })

/******/ });
});