window.exports = {};

window.addEventListener("load", onLoad);

var input;
var audio;
var blobLog;
var headersLog;
var ctx;
var RiffWaveReader;

function onLoad() {
  RiffWaveReader = window.exports.RiffWaveReader;
  input = document.getElementById("file");
  audio = document.getElementById("audio");
  blobLog = document.getElementById("blobLog");
  headersLog = document.getElementById("headersLog");
  var canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  input.addEventListener("change", onChanged, false);
}
function onChanged() {
  var count = this.files.length;

  audio.src = "";
  blobLog.innerText = "";
  headersLog.innerText = "";

  if (count === 0) return;
  if (this.files[0].type !== "audio/wav") return;

  var blob = this.files[0];
  blobLog.innerText = JSON.stringify(
    {
      name: blob.name,
      size: blob.size,
      type: blob.type
    },
    null,
    "  "
  );

  showInPlayer(blob);
  showDetails(blob);
}
function showInPlayer(blob) {
  const reader = new FileReader();
  reader.onload = function(e) {
    audio.src = e.target.result;
  };
  reader.readAsDataURL(blob);
}
function showDetails(blob) {
  const reader = new FileReader();
  reader.onload = function(e) {
    var reader = new RiffWaveReader(e.target.result);
    reader.readChunks().then(function(chunks) {
      headersLog.innerText = JSON.stringify(chunks, null, "  ");
      showWaveForm(reader, chunks);
    });
  };
  reader.readAsArrayBuffer(blob);
}
function showWaveForm(reader, chunks) {
  var channel = 0;
  var count = chunks.format.sampleCount;
  var width = 1024;
  var height = 128;
  ctx.moveTo(0, height / 2);
  readNext(0);
  function readNext(i) {
    return reader.readSample(channel, i).then(function(value) {
      if (value < 0) {
        value += 128;
      } else if (value > 0) {
        value -= 127;
      }
      value += 128;
      var x = (i / count) * width;
      var y = (value / 255) * height;
      ctx.lineTo(x, y);
      ctx.stroke();
      if (i < count) return readNext(++i);
    });
  }
}
