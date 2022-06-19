#!/usr/bin/env node

const polyfill = require("babel-polyfill");
const fs = require("fs");
const path = require("path");

if (!fs.existsSync(path.join(__dirname, "dist"))) {
  throw new Error(
    "You must run the server-side transpile build first (usually, gulp build)"
  );
}

const config = require("./dist/config")();
const debug = require("debug");
 // This must be the first use of 'debug' (after config is loaded)
debug("xeno:main")("Starting xeno.video");

const deps = require("./dist/deps").default(config);

const {container} = deps;

const {emitter} = container;
emitter.emit("Hello!");

const {server} = container;
server.listen(container.config.PORT);
