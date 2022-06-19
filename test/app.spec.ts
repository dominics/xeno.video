import deps from "../src/deps";
import config from "../src/config";

describe("module app", () => {
  let sut = null;

  beforeAll(() => {
    sut = deps(config()).container.app;
  });

  it("is an express instance", () => {
    expect(sut?.use).toBeDefined();
    expect(typeof sut.use).toBe("function");
  });
});
//
