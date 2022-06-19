import Api from "../../src/reddit/Api";

describe("class reddit.Api", function () {
  this.api = null;

  beforeAll(() => {
    this.api = new Api();
  });

  describe(".subreddit(sub, sort)", () => {
    it("is a function", () => {
      expect(this.api.subreddit).toBeInstanceOf(Function);
    });
  });

  describe(".multis()", () => {
    it("is a function", () => {
      expect(this.api.multis).toBeInstanceOf(Function);
    });
  });

  describe(".subscribed()", () => {
    it("is a function", () => {
      expect(this.api.subscribed).toBeInstanceOf(Function);
    });
  });
});
