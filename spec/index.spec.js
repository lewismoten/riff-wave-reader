import reader from "../index.js";

describe("riff-wave-reader", () => {
  it("can initialize", () => {
    expect(typeof reader).toBe("function");
  });
});
