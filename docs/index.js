window.exports = {};

window.addEventListener("load", onLoad);

var input;
var audio;
var blogLog;
var out;
var RiffWaveReader;

function onLoad() {
  RiffWaveReader = window.exports.RiffWaveReader;
  input = document.getElementById("file");
  audio = document.getElementById("audio");
  blobLog = document.getElementById("blobLog");
  headersLog = document.getElementById("headersLog");
  input.addEventListener("change", onChanged, false);
}
function onChanged() {
  var count = this.files.length;

  audio.src = "";
  blobLog.innerText = "";
  headersLog.innerText = "";

  if (count === 0) return;
  if (this.files[0].type !== "audio/wav") return;

  var blog = this.files[0];
  blobLog.innerText = JSON.stringify(
    {
      name: blog.name,
      size: blog.size,
      type: blog.type
    },
    null,
    "  "
  );

  showInPlayer(blog);
  showDetails(blog);
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
    });
  };
  reader.readAsArrayBuffer(blob);
}
