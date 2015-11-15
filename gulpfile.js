'use strict'; // eslint-disable-line strict

const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const babel = require('gulp-babel');
const bower = require('gulp-bower');
const bowerFiles = require('bower-files');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const concat = require('gulp-concat');
const del = require('del');
const debug = require('gulp-debug');
const eslint = require('gulp-eslint');
const gls = require('gulp-live-server');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const lazypipe = require('lazypipe');
const path = require('path');
const rename = require('gulp-rename');
const sequence = require('gulp-sequence');
const sass = require('gulp-sass');
const shell = require('gulp-shell');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const sourcemapify = require('sourcemapify');

/**
 * Configuration
 */
const config = require('./config');

/*
 * Pipeline definitions
 */

const pipes = {
  jsLint: lazypipe()
    .pipe(eslint)
    .pipe(eslint.format),
};

const sources = {
  jsClient: () => browserify({
    entries: config.paths.client.entryPoint,
    debug: config.browserifyDebug,
    transform: [babelify.configure(config.babelOptions.client)],
    extensions: ['.jsx'],
  }).plugin(sourcemapify, { base: 'public/js' })
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify error'))
    .pipe(source(config.paths.client.compiled))
    .pipe(buffer()),
  jsClientSource: () => gulp.src(
    config.paths.client.src.js, { base: 'src' }
  ),
  jsServer: () => gulp.src(
    config.paths.server.src.js, { base: 'src' }
  ),
  jsServerSource: () => gulp.src(
    config.paths.server.src.js, { base: 'src' }
  ),
  scss: () =>
    gulp.src(config.paths.css.src.scss),
  bower: () => {
    return bowerFiles({
      overrides: config.paths.bower.overrides,
    })
    .camelCase(false)
    .join({
      font: ['eot', 'otf', 'woff', 'woff2', 'ttf', 'svg'],
      js: ['js', 'jsx'],
    });
  },
};

/*
 * And finally, our task definitions
 */

gulp.task('default', ['build']);

gulp.task('build', sequence('clean', ['jsBuild', 'jsLint', 'css']));

gulp.task('clean', () => {
  return del(config.outputs);
});

gulp.task('js', ['jsClient', 'jsServer']);

gulp.task('jsBuild', ['bower', 'jsClientBuild', 'jsServerBuild']);
gulp.task('jsLint', ['jsClientSource', 'jsServerSource']);

gulp.task('jsClient', ['bower', 'jsClientBuild', 'jsClientSource']);
gulp.task('jsServer', ['jsServerBuild', 'jsServerSource']);

gulp.task('bower', ['bowerInstall', 'bowerJs', 'bowerFont']);

gulp.task('docker', () => shell.task([
  'docker run --env-file=.env .',
]));

gulp.task('shell', () => shell.task([
  config.paths.server.entryPoint,
]));

gulp.task('pkill', () => shell.task([
  'pkill -f \' bin/www \' || true',
]));

gulp.task('bowerInstall', () => {
  return bower()
    .pipe(gulp.dest(config.paths.bower.src));
});

gulp.task('bowerJs', ['bowerInstall'], () => {
  const files = sources.bower()
    .match('!**/*.min.js')
    .ext('js')
    .files;

  return gulp.src(files.concat(config.paths.socket))
    .pipe(debug({title: 'bower-build-input'}))
    .pipe(gulpif(config.sourcemap, sourcemaps.init({loadMaps: true})))
    .pipe(concat('common.js'))
    .pipe(gulpif(config.compress, uglify({mangle: false})))
    .pipe(gulpif(config.sourcemap, sourcemaps.write('./')))
    .pipe(debug({title: 'bower-build-output'}))
    .pipe(gulp.dest(config.paths.bower.output.js));
});

gulp.task('bowerFont', ['bowerInstall'], () => {
  const files = sources.bower()
    .ext('font')
    .files;

  return gulp.src(files)
    .pipe(debug({title: 'bower-font-input'}))
    .pipe(gulp.dest(config.paths.bower.output.font));
});

gulp.task('jsClientBuild', () => {
  return sources.jsClient()
    .pipe(debug({title: 'client-build-input'}))
    .pipe(gulpif(config.sourcemap, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(config.compress, uglify({mangle: false})))
    .pipe(gulpif(config.sourcemap, sourcemaps.write('./')))
    .pipe(debug({title: 'client-build-output'}))
    .pipe(gulp.dest(config.paths.client.output));
});

gulp.task('jsClientSource', () => {
  return sources.jsClientSource()
    .pipe(gulpif(config.linting, pipes.jsLint()));
});

gulp.task('jsServerBuild', ['copyEsLintGenerated'], () => {
  return sources.jsServer()
    .pipe(debug({title: 'server-build-input'}))
    .pipe(gulpif(config.sourcemap, sourcemaps.init()))
    .pipe(babel(config.babelOptions.server))
    .pipe(gulpif(config.sourcemap, sourcemaps.write('.')))
    .pipe(debug({title: 'server-build-output'}))
    .pipe(gulp.dest(config.paths.server.output));
});

gulp.task('copyEsLintGenerated', () => {
  return gulp.src('./.eslintrc-generated')
    .pipe(rename({
      basename: '.eslintrc',
    }))
    .pipe(gulp.dest(config.paths.server.output));
});

gulp.task('jsServerSource', () => {
  return sources.jsServerSource()
    .pipe(gulpif(config.linting, pipes.jsLint()));
});

gulp.task('css', ['bowerInstall'], () => {
  return sources.scss()
    .pipe(gulpif(config.sourcemap, sourcemaps.init({loadMaps: true})))
    .pipe(sass({
      outputStyle: config.compress ? 'compressed' : 'expanded',
      includePaths: [
        './scss',
        path.join(config.paths.bower.src, 'bootstrap-sass/assets/stylesheets'),
        path.join(config.paths.bower.src, 'font-awesome/scss'),
      ],
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(gulpif(config.sourcemap, sourcemaps.write('./')))
    .pipe(gulp.dest(config.paths.css.output));
});

gulp.task('watch', ['build'], () => {
  const server = gls(config.paths.server.entryPoint);
  server.start();

  const notify = (file) => {
    console.log('Notifying');
    return server.notify.apply(server, [file]);
  };

  const restart = (file) => {
    return server.stop().then(() => {
      console.log('In callback after server stop');
      return server.start();
    }).then(() => {
      console.log('In callback after server restarted?');
      return notify(file);
    });
  };

  // Restart the server when file changes
  gulp.watch(['public/*.html', 'public/images/*'], notify);

  gulp.watch(config.paths.css.src.scss, ['css'], notify);

  gulp.watch([
    config.paths.client.src.js,
  ], ['jsClient'], notify);

  gulp.watch([
    config.paths.server.src.js,
    config.paths.server.src.jade,
  ], ['jsServer'], restart);

  // gulp.watch([
  //   config.paths.server.output + '/**/*.js',
  // ], restart);
});
