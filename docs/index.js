window.addEventListener("load", onLoad);
var input;
function onLoad() {
  input = document.getElementById("file");
  input.addEventListener("change", onChanged, false);
}
function onChanged() {
  var count = this.files.length;
  var details = {
    count: count
  };
  if (count > 0) {
    var field = this.files[0];
    details.size = field.size;
    details.name = field.name;
    details.type = field.type;
  }
  alert(JSON.stringify(details, null, "  "));
}
