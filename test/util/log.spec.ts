import log from "../../src/util/log";

const _outfile = (ident) => outfile.apply(undefined, ["util", "log", ident]);

describe("module log", () => {
  describe("class Log", () => {
    it("can be instantiated, for whatever good that does", () => {
      expect(new log.Log()).toBeInstanceOf(log.Log);
    });

    describe("static methods", () => {
      describe(".setLevel(level)", () => {
        it("can be used to set the log level", () => {
          log.Log.setLevel(log.Log.error);
          expect(log.Log.level).toEqual(log.Log.error);
          log.Log.setLevel(log.Log.debug);
          expect(log.Log.level).toEqual(log.Log.debug);
        });
      });

      describe(".setFile(path)", () => {
        it("can accept multiple paths in a row", () => {
          log.Log.setFile(_outfile("initial"));
          log.Log.log("Some message");
          log.Log.setFile(_outfile("second"));
          log.Log.log("Some message");
        });
      });
    });
  });

  describe("exports convenient short logger forms", () => {
    const tests = [log.error, log.warning, log.notice, log.info, log.debug];

    log.Log.setFile(_outfile("short-form"));

    tests.forEach((test) => {
      describe(`function ${  test.name}`, () => {
        it("is a logger helper function", () => {
          test("Some log message", { some: "context" });
        });
      });
    });
  });
});
