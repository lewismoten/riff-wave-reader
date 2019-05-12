const path = require('path');

const base = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    library: "riff-wave-reader",
    libraryTarget: "umd",
    globalObject: "this",
    filename: "riff-wave-reader.js"
  }
}

module.exports = [
  Object.assign({}, base, {
    mode: "production",
    output: Object.assign({}, base.output, {
      path: path.resolve(__dirname, "lib")
    })
  }),
  Object.assign({}, base, {
    mode: "development",
    output: Object.assign({}, base.output, {
      path: path.resolve(__dirname, "docs/dist")
    })
  })
];
