import Reader from "../index.js";
const path = require("path");

describe("riff-wave-reader", () => {
  it("is function", () => {
    expect(typeof Reader).toBe("function");
  });
  it("can instantiate", () => {
    const reader = new Reader();
    expect(typeof reader).toBe("object");
  });
});
