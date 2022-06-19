import config from "../src/config";

describe("module config", () => {
  it("is a constructor function", () => {
    expect(config).toBeInstanceOf(Function);
  });

  it("returns an object, which is the resolved config", () => {
    const instance = config();
    expect(instance).toBeInstanceOf(Object);
    expect(typeof instance.NODE_ENV).toBe("string");
  });
});
