const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const babel = require('gulp-babel');
const bower = require('gulp-bower');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const eslint = require('gulp-eslint');
const fs = require('fs');
const gls = require('gulp-live-server');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const lazypipe = require('lazypipe');
const sass = require('gulp-sass');
const shell = require('gulp-shell');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

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
  linting: debug,
  sourcemap: debug,
  compress: !debug,

  paths: {
    server: {
      entryPoint: 'bin/www',
      src: {
        js: ['src/**/*.js', '!src/client/**'],
        jsx: ['src/**/*.jsx'],
        jade: ['src/views/**/*.jade'],
      },
      output: './dist',
    },

    client: {
      entryPoint: './src/client/app.jsx',
      src: {
        js: ['src/client/**/*.js'],
        jsx: ['src/client/**/*.jsx'],
      },
      compiled: 'app.js',
      output: './public/js/',
    },

    bower: './bower_components',

    css: {
      src: {
        scss: ['./src/scss/style.scss'],
      },
      output: './public/css',
    },
  },

  babelOptions: {
    optional: ['es7.classProperties'],
  },
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
  jsClient: () => (
    browserify({
      entries: config.paths.client.entryPoint,
      debug: debug,
    }).transform(
      babelify.configure(config.babelOptions)
    )
  ),
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

gulp.task('default', ['build', 'lint']);

gulp.task('build', ['jsBuild', 'css']);
gulp.task('lint', ['jsLint']);

gulp.task('js', ['jsClient', 'jsServer']);

gulp.task('jsBuild', ['jsClientBuild', 'jsServerBuild']);
gulp.task('jsLint',  ['jsClientSource', 'jsServerSource']);

gulp.task('jsClient', ['jsClientBuild', 'jsClientSource']);
gulp.task('jsServer', ['jsServerBuild', 'jsServerSource']);

gulp.task('run:docker', shell.task([
  'docker run --env-file=.env .',
]));

gulp.task('run:shell', shell.task([
  config.paths.server.entryPoint,
]));

gulp.task('util:pkill', shell.task([
  'pkill -f node\\ bin/www || true',
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
    .bundle()
    .pipe(source(config.paths.client.compiled))
    .pipe(buffer())
    .pipe(gulpif(config.sourcemap, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(config.compress, uglify({ mangle: false })))
    .on('error', gutil.log)
    .pipe(gulpif(config.sourcemap, sourcemaps.write('./')))
    .pipe(gulp.dest(config.paths.client.output));
});

gulp.task('jsClientSource', () => {
  return sources.jsClientSource()
    .pipe(gulpif(config.linting, pipes.jsLint()));
});

gulp.task('jsServerBuild', () => {
  return sources.jsServer()
    .pipe(buffer())
    .pipe(gulpif(config.sourcemap, sourcemaps.init({loadMaps: true})))
    .pipe(babel(config.babelOptions))
    .on('error', gutil.log)
    .pipe(gulpif(config.sourcemap, sourcemaps.write('./')))
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

gulp.task('watch', ['build', 'lint', 'util:pkill'], () => {
  const server = gls(config.paths.server.entryPoint);

  server.start();

  const notify = (file) => {
    server.notify.apply(server, [file]);
  };

  const restart = (file) => {
    server.stop().then(() => server.start()).then(() => notify(file));
  };

  // Restart the server when file changes
  gulp.watch(['public/*.html'], notify);
  gulp.watch(['public/images/*'], notify);

  gulp.watch(config.paths.css.src.scss, ['css', notify]);

  gulp.watch([
    config.paths.client.src.js,
    config.paths.client.src.jsx,
  ], ['jsClient', notify]);

  gulp.watch([
    config.paths.server.src.js,
    config.paths.server.src.jsx,
    config.paths.server.src.jade,
  ], ['jsServer']);

  gulp.watch([
    config.paths.server.output + '/**/*.js',
  ], restart);
});
