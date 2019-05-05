window.addEventListener("load", onLoad);
var input;
function onLoad() {
  input = document.getElementById("file");
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
    alert(e.target.result);
    // e.target.result
  };
  reader.readAsDataURL(field);

  //alert(JSON.stringify(details, null, "  "));
}
