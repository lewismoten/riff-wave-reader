window.addEventListener("load", onLoad);
var input;
var audio;

function onLoad() {
  input = document.getElementById("file");
  audio = document.getElementById("audio");
  input.addEventListener("change", onChanged, false);
}
function onChanged() {
  var count = this.files.length;

  if (count === 0) return;
  if (this.files[0].type !== "audio/wav") return;

  var details = {
    count: count
  };
  var field = this.files[0];
  details.size = field.size;
  details.name = field.name;
  details.type = field.type;

  const reader = new FileReader();
  reader.onload = function(e) {
    audio.src = e.target.result;
  };
  reader.readAsDataURL(field);
}
