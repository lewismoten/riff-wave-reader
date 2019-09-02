const http = require("http");
const path = require("path");
const fs = require("fs");

const app = http.createServer((request, response) => {
  console.log(request.url);
  let filePath = path.join(__dirname, "..", request.url);
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.write("Error\r\n");
      response.write(JSON.stringify(error, null, "  "));
      response.write("Tried to read: " + filePath);
      response.end();
    } else {
      const contentType = getContentType(path.extname(filePath));
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
});
const PORT = 3000;
app.listen(PORT);

console.log(`Website running on port ${PORT}`);

const url = `http://localhost:${PORT}/docs/index.html`;
const start =
  process.platform == "darwin"
    ? "open"
    : process.platform == "win32"
    ? "start"
    : "xdg-open";
require("child_process").exec(`${start} ${url}`);

const getContentType = ext =>
  ({
    ".js": "text/javascript",
    ".html": "text/html"
  }[ext] || "text/plain");
