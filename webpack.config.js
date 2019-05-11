const path = require('path');

const base = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    library: "RiffWaveReader",
    libraryTarget: "umd",
    filename: "riff-wave-reader.js",
    path: "what is this??"
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
