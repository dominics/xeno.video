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

/*
 * Main Settings
 */

var debug = (process.env.NODE_ENV == 'development');

var config = {
    paths: {
        server:          'bin/www',
        clientSource:    './client/app.jsx',
        clientCompiled:  'app.js',
        clientOutputDir: './public/js/',
        scssSource:      './scss/*.scss',
        cssOutputDir:    './public/css',
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

};

var sources = {
    js: () => browserify({
            entries: config.paths.clientSource,
            debug:   debug
        }).transform(reactify)
};

/*
 * And finally, our task definitions
 */

gulp.task('default', ['build']);
gulp.task('build', ['js', 'css']);

gulp.task('run:docker', shell.task([
    'docker run --env-file=.env .'
]));

gulp.task('run:shell', shell.task([
    config.paths.server
]));

gulp.task('js', function () {
    return sources.js()
        .bundle()
        .pipe(source(config.paths.clientCompiled))
        .pipe(buffer())
        .pipe(gulpif(config.sourcemap, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(config.compress, uglify(), beautify()))
        .pipe(gulpif(config.linting, pipes.jsHint()))
        .on('error', gutil.log)
        .pipe(gulpif(config.sourcemap, sourcemaps.write('./')))
        .pipe(gulp.dest(config.paths.clientOutputDir))
});

gulp.task('css', function () {
    gulp.src(config.paths.scssSource)
        .pipe(gulpif(config.sourcemap, sourcemaps.init()))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade:  false
        }))
        .pipe(gulpif(config.sourcemap, sourcemaps.write()))
        .pipe(gulp.dest(config.paths.cssOutputDir));
});

gulp.task('watch', ['build'], function () {
    var server = gls(app);
    server.start();

    var notify = function (file) {
        server.notify.apply(server, [file]);
    };

    // Restart the server when file changes
    gulp.watch(['public/*.html'], notify);
    gulp.watch(['public/images/*'], notify);

    gulp.watch([config.paths.scssSource], ['css', notify]);
    gulp.watch(['client/**/*.js', 'client/**/*.jsx'], ['js', notify]);

    gulp.watch(['*.js', 'routes/**/*.js'], ['build', function () {
        server.stop().then(function () {
            server.start();
        });
    }]);
});
