window.addEventListener("load", onLoad);
var input;
var audio;
var out;

function onLoad() {
  input = document.getElementById("file");
  audio = document.getElementById("audio");
  blobLog = document.getElementById("blobLog");
  input.addEventListener("change", onChanged, false);
}
function onChanged() {
  var count = this.files.length;

  audio.src = "";
  blobLog.innerText = "";
  if (count === 0) return;
  if (this.files[0].type !== "audio/wav") return;

  var field = this.files[0];

  showInPlayer(field);
  showDetails(field);
}
function showInPlayer(blob) {
  const reader = new FileReader();
  reader.onload = function(e) {
    audio.src = e.target.result;
  };
  reader.readAsDataURL(blob);
}
function showDetails(blob) {
  blobLog.innerText = JSON.stringify(
    {
      name: blob.name,
      size: blob.size,
      type: blob.type
    },
    null,
    "  "
  );

  const reader = new FileReader();
  reader.onload = function(e) {
    var array = e.target.result;
  };
  reader.readAsArrayBuffer(blob);
}
