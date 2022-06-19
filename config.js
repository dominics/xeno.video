/**
 * This is the build configuration
 *
 * It optionally reads .env into the environment. It only
 * makes use of only a few variables, though. It's mostly static
 * paths, and it has to be; it has to be completely valid
 * ES5+ for the current node parser; this is read before
 * any transpilation happens.
 *
 * Options:
 *   NODE_ENV: string, development|production
 *   TEST_USE_CHROME 1|0
 *   DEBUG_PORT int
 *
 * @todo Move all of this into webpack configuration?
 */
const path = require("path");
const fs = require("fs");

const conf = __dirname + "/.env";

if (fs.existsSync(conf)) {
  require("node-env-file")(conf);
} else {
  require("debug")("xeno:env")("No env file found", conf);
}

const debug = process.env.NODE_ENV === "development";
const output = path.join(__dirname, "build");

const nodeOptions = [];

if (process.env.DEBUG_PORT) {
  nodeOptions.push(`--debug=${process.env.DEBUG_PORT}`);
  nodeOptions.push("--nolazy");
}

const config = {
  debug: debug,
  linting: debug,
  sourcemap: debug,
  compress: !debug,
  browserifyDebug: debug,

  node: `${process.execPath} ${nodeOptions.join(" ")}`,
  nodeOptions: nodeOptions,
  vendorRegex: /(node_modules)/,

  socket: "./node_modules/socket.io-client/socket.io.js",

  build: {
    output: output,
    lcov: output,
  },

  server: {
    entryPoint: "./index.js",
    src: {
      js: ["src/**/*.js?(x)"], // We include the client-side code, so we can unit-test it server-side
      jsExcl: ["src/**/*.js?(x)", "!src/client/**/*.js?(x)"],
      jade: ["src/views/**/*.jade"],
    },
    output: "dist",
  },

  client: {
    entryPoint: "./src/client/app.jsx",
    src: {
      js: ["src/client/**/*.js?(x)"],
    },
    compiled: "app.js",
    output: "public/js/",
  },

  test: {
    src: ["test/**/*.js", "!test/fixture/**/*"],
    output: "dist-test",
    tests: "dist-test/**/*.spec.js",
    bootstrap: "./dist-test/bootstrap.js",
    coverage: "dist/**/*.js",
  },

  css: {
    entryPoint: "src/scss/style.scss",
    src: {
      scss: ["src/scss/**/*.scss"],
    },
    output: "public/css",
  },
};

config.clean = [
  config.client.output,
  config.server.output,
  config.test.output,
  config.css.output,
];

module.exports = config;
