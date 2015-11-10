const gulp = require('gulp');
const gls = require('gulp-live-server');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const shell = require('gulp-shell');
const gulpif = require('gulp-if');
const lazypipe = require('lazypipe');
const eslint = require('gulp-eslint');
const fs = require('fs');

/**
 * Configuration
 */
const conf = __dirname + '/.env';

if (fs.existsSync(conf)) {
  console.log('Loading!');
  require('node-env-file')(conf);
} else {
  console.log('No env file at ' + conf);
}

const logger = require('debug')('gulp');

/*
 * Main Settings
 */

const debug = (process.env.NODE_ENV === 'development');

const config = {
  paths: {
    server: 'bin/www',
    serverSource: ['*.js', 'routes/*.js', 'gulpfile.js'],
    serverJadeSource: ['views/*.jade'],
    client: './client/app.jsx',
    clientSource: ['client/**/*.js'],
    clientJsxSource: ['client/**/*.jsx'],
    clientCompiled: 'app.js',
    clientOutputDir: './public/js/',
    scssSource: ['./scss/*.scss'],
    cssOutputDir: './public/css',
  },

  linting: debug,
  sourcemap: debug,
  compress: !debug,
};

logger('config', config);

/*
 * Pipeline definitions
 */

const pipes = {
  jsLint: lazypipe()
    .pipe(eslint)
    .pipe(eslint.format),

  scss: lazypipe()
    .pipe(sass, {
      outputStyle: config.compress ? 'compressed' : 'expanded',
    })
    .pipe(autoprefixer, {
      browsers: ['last 2 versions'],
      cascade: false,
    }),
};

const sources = {
  jsClient: () => browserify({
    entries: config.paths.client,
    debug: debug,
  }).transform(babelify.configure({
    optional: ['es7.classProperties'],
  })),
  jsClientSource: () => gulp.src(config.paths.clientSource.concat(config.paths.clientJsxSource)),
  jsServer: () => gulp.src(config.paths.serverSource),
  scss: () => gulp.src(config.paths.scssSource),
};

/*
 * And finally, our task definitions
 */

gulp.task('default', ['build']);
gulp.task('build', ['js', 'css']);
gulp.task('js', ['jsClientBuild', 'jsClientSource', 'jsServer']);

gulp.task('run:docker', shell.task([
  'docker run --env-file=.env .',
]));

gulp.task('run:shell', shell.task([
  config.paths.server,
]));

gulp.task('util:pkill', shell.task([
  'pkill -f node\\ bin/www || true',
]));

gulp.task('jsClientBuild', () => {
  return sources.jsClient()
    .bundle()
    .pipe(source(config.paths.clientCompiled))
    .pipe(buffer())
    .pipe(gulpif(config.sourcemap, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(config.compress, uglify({ mangle: !config.sourcemap })))
    .on('error', gutil.log)
    .pipe(gulpif(config.sourcemap, sourcemaps.write('./js')))
    .pipe(gulp.dest(config.paths.clientOutputDir));
});

gulp.task('jsClientSource', () => {
  return sources.jsClientSource()
    .pipe(gulpif(config.linting, pipes.jsLint()));
});

gulp.task('jsServer', () => {
  return sources.jsServer()
    .pipe(gulpif(config.linting, pipes.jsLint()));
});

gulp.task('css', () => {
  return sources.scss()
    .pipe(gulpif(config.sourcemap, sourcemaps.init()))
    .pipe(pipes.scss())
    .pipe(gulpif(config.sourcemap, sourcemaps.write()))
    .pipe(gulp.dest(config.paths.cssOutputDir));
});

gulp.task('watch', ['build', 'util:pkill'], () => {
  const server = gls(config.paths.server);
  server.start();

  const notify = (file) => {
    server.notify.apply(server, [file]);
  };

  // Restart the server when file changes
  gulp.watch(['public/*.html'], notify);
  gulp.watch(['public/images/*'], notify);

  gulp.watch(config.paths.scssSource, ['css', notify]);

  gulp.watch([
    config.paths.clientSource,
    config.paths.clientJsxSource,
  ], ['jsClientBuild', 'jsClientSource', notify]);

  gulp.watch(config.paths.serverSource.concat(config.paths.serverJadeSource), ['jsServer', (file) => {
    server.stop().then(() => server.start()).then(() => notify(file));
  }]);
});
