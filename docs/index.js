window.exports = {};

window.addEventListener("load", onLoad);

var input;
var audio;
var blobLog;
var headersLog;
var contexts = [];
var canvases = [];
var RiffWaveReader;

function onLoad() {
  RiffWaveReader = window.exports.RiffWaveReader;
  input = document.getElementById("file");
  audio = document.getElementById("audio");
  blobLog = document.getElementById("blobLog");
  headersLog = document.getElementById("headersLog");
  canvases.push(document.getElementById("canvas1"));
  canvases.push(document.getElementById("canvas2"));
  contexts.push(canvases[0].getContext("2d"));
  contexts.push(canvases[1].getContext("2d"));
  input.addEventListener("change", onChanged, false);
}
function onChanged() {
  var count = this.files.length;

  audio.src = "";
  blobLog.innerText = "";
  headersLog.innerText = "";
  for (var i = 0; i < contexts.length; i++) {
    contexts[i].clearRect(0, 0, canvases[i].width, canvases[i].height);
  }

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
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    var reader = new RiffWaveReader(e.target.result);
    reader.readChunks().then(function(chunks) {
      headersLog.innerText = JSON.stringify(chunks, null, "  ");
      for (var channel = 0; channel < chunks.format.channels; channel++) {
        showWaveForm(reader, chunks, channel);
      }
    });
  };
  fileReader.readAsArrayBuffer(blob);
}
function showWaveForm(reader, chunks, channel) {
  var count = chunks.data.sampleCount;
  var sampleSize = chunks.format.sampleSize;
  var canvas = canvases[channel];
  var ctx = contexts[channel];
  var width = canvas.width;
  var height = canvas.height;
  ctx.moveTo(0, height / 2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#0000ff44";
  ctx.beginPath();
  readNext(0)
    .then(function() {
      ctx.stroke();
    })
    .catch(function(e) {
      alert(e);
      ctx.stroke();
    });
  function readNext(i) {
    return reader.readSample(channel, i).then(function(value) {
      var x = (i / count) * width;
      var y = getY(value);
      ctx.lineTo(x, y);
      if (++i !== count) return readNext(i);
    });
  }
  function getY(value) {
    switch(sampleSize) {
      default:
      case 1:
        return (value / 255) * height;
      case 2:
        //return (value / 65535) * height;
        return ((value + 32768) / 65535) * height;
    }
  }
}
