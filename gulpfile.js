
 // eslint-disable-line strict

const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const babelify = require("babelify");
const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const concat = require("gulp-concat");
const del = require("del");
const debug = require("gulp-debug");
const eslint = require("gulp-eslint");
const fs = require("fs");
const gls = require("gulp-live-server");
const gulp = require("gulp");
const gulpif = require("gulp-if");
const gutil = require("gulp-util");
const isparta = require("isparta");
const istanbul = require("gulp-istanbul");
const mocha = require("gulp-mocha");
const path = require("path");
const Promise = require("bluebird");
const sequence = require("gulp-sequence");
const sass = require("gulp-sass");
const shell = require("gulp-shell");
const vinylSource = require("vinyl-source-stream");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const sourcemapify = require("sourcemapify");
const _ = require("lodash");

Promise.promisifyAll(fs);

/*
 * Configuration
 */
const config = require("./config");

/*
 * Helpers
 */
function mkdirp(dir) {
  return fs
    .statAsync(dir)
    .then((stat) => stat.isDirectory
        ? Promise.resolve()
        : Promise.reject(Error("Could not mkdirp: path already exists")))
    .catch((err) => fs.mkdirAsync(dir))
    .catch((err) => {
      if (err.errno !== -17) throw err;
      /* already created */
    });
}

/*
 * Meta tasks
 */
// Abstract
gulp.task("default", sequence("build", ["test", "lint"]));
gulp.task("build", sequence("clean", ["lib", "css"]));
gulp.task("lib", sequence("js", "coverage"));

// Concrete
gulp.task("lint", ["lintClient", "lintServer"]);
gulp.task("js", ["jsClient", "jsServer", "jsTest"]);

/*
 * And finally, our task definitions
 */
gulp.task("docker", () => shell.task(["docker run --env-file=.env ."]));

gulp.task("shell", () => shell.task([config.server.entryPoint]));

gulp.task("pkill", () =>
  shell.task(["bash -c \"pkill -e -f 'node.*index.js$' || true\""], {
    verbose: true,
  })
);

gulp.task("clean", () => del(config.clean));

gulp.task("jsClient", () => browserify({
    entries: config.client.entryPoint,
    debug: config.browserifyDebug,
    extensions: [".jsx"],
    cache: {},
    packageCache: {},
  })
    .transform("babelify")
    .plugin(sourcemapify, { base: "public/js" })
    .bundle()
    .on("error", gutil.log.bind(gutil, "Browserify error"))
    .pipe(vinylSource(config.client.compiled))
    .pipe(debug({ title: "browserify-bundle-output" }))
    .pipe(buffer())
    .pipe(debug({ title: "client-build-input" }))
    .pipe(gulpif(config.sourcemap, sourcemaps.init({ loadMaps: true })))
    .pipe(gulpif(config.compress, uglify({ mangle: false })))
    .pipe(gulpif(config.sourcemap, sourcemaps.write("./")))
    .pipe(debug({ title: "client-build-output" }))
    .pipe(gulp.dest(config.client.output)));

gulp.task("lintClient", () => gulp
    .src(config.client.src.js)
    .pipe(gulpif(config.linting, eslint()))
    .pipe(gulpif(config.linting, eslint.format())));

gulp.task("jsServer", () => gulp
    .src(config.server.src.js)
    .pipe(debug({ title: "server-build" }))
    .pipe(gulpif(config.sourcemap, sourcemaps.init()))
    .pipe(babel())
    .pipe(gulpif(config.sourcemap, sourcemaps.write(".")))
    .pipe(gulp.dest(config.server.output)));

gulp.task("lintServer", () => gulp
    .src(config.server.src.js)
    .pipe(gulpif(config.linting, eslint()))
    .pipe(gulpif(config.linting, eslint.format())));

gulp.task("jsTest", () => gulp
    .src(config.test.src)
    .pipe(debug({ title: "test-build" }))
    .pipe(gulpif(config.sourcemap, sourcemaps.init()))
    .pipe(babel())
    .pipe(gulpif(config.sourcemap, sourcemaps.write(".")))
    .pipe(gulp.dest(config.test.output)));

gulp.task("coverage", () => gulp
    .src(config.test.coverage)
    .pipe(istanbul({ instrumenter: isparta.Instrumenter }))
    .pipe(istanbul.hookRequire()));

gulp.task("css", () => gulp
    .src(config.css.entryPoint)
    .pipe(debug({ title: "css-build" }))
    .pipe(gulpif(config.sourcemap, sourcemaps.init({ loadMaps: true })))
    .pipe(
      sass({
        outputStyle: config.compress ? "compressed" : "expanded",
        includePaths: [
          "./scss",
        ],
      })
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulpif(config.sourcemap, sourcemaps.write("./")))
    .pipe(gulp.dest(config.css.output)));

/* Test tasks */
gulp.task("test", ["coverage"], () => {
  mkdirp(config.build.output);

  return gulp
    .src(config.test.tests, { read: false })
    .pipe(
      mocha({
        ui: "bdd",
        reporter: "spec",
        require: [config.test.bootstrap],
      })
    )
    .pipe(
      istanbul.writeReports({
        dir: config.build.lcov,
        reporters: ["lcov"],
      })
    );
});

/* Watch tasks */
gulp.task("watch", ["build", "pkill"], () => {
  const server = gls(config.server.entryPoint);
  server.start();

  const notify = (file) => {
    console.log("Notifying");
    return server.notify.apply(server, [file]);
  };

  const restart = _.debounce((file) => server
      .stop()
      .then(() => server.start())
      .then(() => notify(file)), 3000);

  // Restart the server when file changes
  gulp.watch(["public/*.html", "public/images/*"], notify);

  gulp.watch(config.css.src.scss, ["css"], notify);

  gulp.watch([config.client.src.js], ["jsClient", "jsServer"], notify);

  gulp.watch(
    [config.server.src.jsExcl, config.server.src.jade],
    ["jsServer"],
    restart
  );

  gulp.watch([`${config.server.output  }/**/*.js`], restart);

  gulp.watch(config.test.src, ["jsTest"]);
});
