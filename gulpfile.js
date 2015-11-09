'use strict';

var gulp         = require('gulp');
var gls          = require('gulp-live-server');
var browserify   = require('browserify');
var reactify     = require('reactify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var uglify       = require('gulp-uglify');
var beautify     = require('gulp-jsbeautify');
var sourcemaps   = require('gulp-sourcemaps');
var gutil        = require('gulp-util');
var jshint       = require('gulp-jshint');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var shell        = require('gulp-shell');
var gulpif       = require('gulp-if');
var lazypipe     = require('lazypipe');
var eslint        = require('gulp-eslint');

/*
 * Main Settings
 */

var debug = (process.env.NODE_ENV == 'development');

var config = {
    paths: {
        server:          'bin/www',
        serverSource:    ['*.js', 'routes/*.js', 'gulpfile.js'],
        client:          './client/app.jsx',
        clientSource:    ['client/**/*.js'],
        clientJsxSource: ['client/**/*.jsx'],
        clientCompiled:  'app.js',
        clientOutputDir: './public/js/',
        scssSource:      ['./scss/*.scss'],
        cssOutputDir:    './public/css'
    },

    linting:   debug,
    sourcemap: debug,
    compress:  !debug
};

/*
 * Pipeline definitions
 */

var pipes = {
    jsHint: lazypipe()
                .pipe(jshint)
                .pipe(jshint.reporter, 'jshint-stylish'),

    jsLint: lazypipe()
                .pipe(eslint)
                .pipe(eslint.format),

    scss: lazypipe()
              .pipe(sass, {
            outputStyle: config.compress ? 'compressed' : 'expanded'
        })
              .pipe(autoprefixer, {
            browsers: ['last 2 versions'],
            cascade:  false
        })
};

var sources = {
    jsClient: () => browserify({
        entries: config.paths.clientEntry,
        debug:   debug
    }).transform(reactify),
    jsClientSource: () => gulp.src(config.paths.clientSource),
    jsServer: () => gulp.src(config.paths.serverSource),
    scss:     () => gulp.src(config.paths.scssSource)
};

/*
 * And finally, our task definitions
 */

gulp.task('default', ['build']);
gulp.task('build', ['js', 'css']);
gulp.task('js', ['jsClientBuild', 'jsClientSource', 'jsServer']);

gulp.task('run:docker', shell.task([
    'docker run --env-file=.env .'
]));

gulp.task('run:shell', shell.task([
    config.paths.server
]));

gulp.task('jsClientBuild', function () {
    return sources.jsClient()
        .bundle()
        .pipe(source(config.paths.clientCompiled))
        .pipe(buffer())
        .pipe(gulpif(config.sourcemap, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(config.compress, uglify(), beautify()))
        .on('error', gutil.log)
        .pipe(gulpif(config.sourcemap, sourcemaps.write('./')))
        .pipe(gulp.dest(config.paths.clientOutputDir))
});

gulp.task('jsClientSource', function () {
    return sources.jsClientSource()
        .pipe(gulpif(config.linting, pipes.jsLint()))
        .pipe(gulpif(config.linting, pipes.jsHint()))
});

gulp.task('jsServer', function () {
    return sources.jsServer()
        .pipe(gulpif(config.linting, pipes.jsLint()))
});

gulp.task('css', function () {
    return sources.scss()
        .pipe(gulpif(config.sourcemap, sourcemaps.init()))
        .pipe(pipes.scss())
        .pipe(gulpif(config.sourcemap, sourcemaps.write()))
        .pipe(gulp.dest(config.paths.cssOutputDir));
});

gulp.task('watch', ['build'], function () {
    var server = gls(config.paths.server);
    server.start();

    var notify = function (file) {
        server.notify.apply(server, [file]);
    };

    // Restart the server when file changes
    gulp.watch(['public/*.html'], notify);
    gulp.watch(['public/images/*'], notify);

    gulp.watch(config.paths.scssSource, ['css', notify]);
    gulp.watch([config.paths.clientSource, config.paths.clientJsxSource], ['js', notify]);

    gulp.watch(['*.js', 'routes/**/*.js'], ['build', function () {
        server.stop().then(function () {
            server.start();
        });
    }]);
});
