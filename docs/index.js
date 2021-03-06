window.addEventListener("load", onLoad);

var input;
var audio;
var blobLog;
var headersLog;
var contexts = [];
var canvases = [];
var RiffWaveReader;

function onLoad() {
  RiffWaveReader = window["riff-wave-reader"].RiffWaveReader;
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
  var bitsPerSample = chunks.format.bitsPerSample;
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
      var y = (1 - getPercent(value)) * height;
      ctx.lineTo(x, y);
      if (++i !== count) return readNext(i);
    });
  }
  function getPercent(value) {
    switch(bitsPerSample) {
      default:
      case 8:
        // uint8
        return (value / 255);
      case 16:
        // int16 -> uint16
        return ((value + 32768) / 65535);
      case 24:
        // int24 -> uint24
        return ((value + 8388608) / 16777214);
    }
  }
}
