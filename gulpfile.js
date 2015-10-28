const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const babel = require('gulp-babel');
const bower = require('gulp-bower');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const del = require('del');
const debug = require('gulp-debug');
const eslint = require('gulp-eslint');
const gls = require('gulp-live-server');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const lazypipe = require('lazypipe');
const rename = require('gulp-rename');
const sequence = require('gulp-sequence');
const sass = require('gulp-sass');
const shell = require('gulp-shell');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

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

  scss: lazypipe()
    .pipe(sass, {
      outputStyle: config.compress ? 'compressed' : 'expanded',
      includePaths: [
        './scss',
        config.paths.bower + '/bootstrap-sass/assets/stylesheets',
        config.paths.bower + '/font-awesome/scss',
      ],
    })
    .pipe(autoprefixer, {
      browsers: ['last 2 versions'],
      cascade: false,
    }),
};

const sources = {
  jsClient: () => browserify({
    entries: config.paths.client.entryPoint,
    debug: config.browserifyDebug,
    transform: [babelify.configure(config.babelOptions.client)],
    extensions: ['.jsx'],
  }).bundle(),
  jsClientSource: () => gulp.src(
    config.paths.client.src.js
      .concat(config.paths.client.src.jsx)
  ),
  jsServer: () => gulp.src(
    config.paths.server.src.js
      .concat(config.paths.server.src.jsx)
  ),
  jsServerSource: () => gulp.src(
    config.paths.server.src.js
      .concat(config.paths.server.src.jsx)
  ),
  scss: () =>
    gulp.src(config.paths.css.src.scss),
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

gulp.task('jsBuild', ['jsClientBuild', 'jsServerBuild']);
gulp.task('jsLint', ['jsClientSource', 'jsServerSource']);

gulp.task('jsClient', ['jsClientBuild', 'jsClientSource']);
gulp.task('jsServer', ['jsServerBuild', 'jsServerSource']);

gulp.task('docker', () => shell.task([
  'docker run --env-file=.env .',
]));

gulp.task('shell', () => shell.task([
  config.paths.server.entryPoint,
]));

gulp.task('pkill', () => shell.task([
  'pkill -f \' bin/www \' || true',
]));

gulp.task('bower', () => {
  return bower()
    .pipe(gulp.dest(config.paths.bower));
});

gulp.task('font-awesome', () => {
  return gulp.src(config.paths.bower + '/font-awesome/fonts/**.*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('jsClientBuild', () => {
  return sources.jsClient()
    .pipe(source(config.paths.client.compiled))
    .pipe(debug({title: 'client-build-input'}))
    .pipe(buffer())
    .pipe(gulpif(config.sourcemap, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(config.compress, uglify({mangle: false})))
    .on('error', gutil.log)
    .pipe(gulpif(config.sourcemap, sourcemaps.write('.')))
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
    .on('error', gutil.log)
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

gulp.task('css', ['bower', 'font-awesome'], () => {
  return sources.scss()
    .pipe(gulpif(config.sourcemap, sourcemaps.init()))
    .pipe(pipes.scss())
    .pipe(gulpif(config.sourcemap, sourcemaps.write()))
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
    config.paths.client.src.jsx,
  ], ['jsClient'], notify);

  gulp.watch([
    config.paths.server.src.js,
    config.paths.server.src.jsx,
    config.paths.server.src.jade,
  ], ['jsServer'], notify);

  gulp.watch([
    config.paths.server.output + '/**/*.js',
  ], restart);
});
