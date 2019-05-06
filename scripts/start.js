const http = require("http");
const path = require("path");
const fs = require("fs");

const app = http.createServer((request, response) => {
  let filePath = path.join(__dirname, "..\\", request.url);
  console.log(request.url, "-->", filePath);
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
app.listen(3000);
const getContentType = ext =>
  ({
    ".js": "text/javascript",
    ".html": "text/html"
  }[ext] || "text/plain");
