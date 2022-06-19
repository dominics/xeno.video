import deps from "../../src/deps";
import config from "../../src/config";

describe("functional test: API routes", function tests() {
  beforeAll(() => {
    this.container = deps(config()).container;
    this.container.config.LOG_FILE = outfile(["functional", "api"]);

    this.app = this.container.stack;
    this.request = request(this.app);
  });

  describe("GET /api/channel/all", () => {
    it("Returns a list of channels", (done) => {
      this.request
        .get("/api/channel/all")
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.type).toEqual("channel");
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.subscribed).toBeInstanceOf(Array);
          expect(res.body.data.multis).toBeInstanceOf(Array);
          expect(res.body.data.defaults).toBeInstanceOf(Array);
        })
        .expect(200, done);
    });
  });

  describe("GET /api/setting/all", () => {
    it("Returns a list of settings", (done) => {
      this.request
        .get("/api/setting/all")
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.type).toEqual("setting");
          expect(res.body.data).toBeInstanceOf(Array);
        })
        .expect(200, done);
    });
  });

  describe("PATCH /api/setting", () => {
    it("Updates settings and then returns them", (done) => {
      const payload = {
        type: "setting",
        data: [
          {
            id: "nsfw",
            value: true,
          },
        ],
      };

      this.request
        .patch("/api/setting")
        .send(payload)
        .set("Content-Type", "application/json")
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.type).toEqual("setting");
          expect(res.body.data).toEqual(
            expect.arrayContaining([{ id: "nsfw", value: true }])
          );
        })
        .expect(200, done);
    });
  });

  describe("GET /api/item/channel/videos", () => {
    it("Returns a list of items", (done) => {
      this.request
        .get("/api/item/channel/videos")
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.type).toEqual("item");
          expect(res.body.data).toBeInstanceOf(Array);
        })
        .expect(200, done);
    });
  });

  afterAll(() => {
    this.container.shutdown();
  });
});
