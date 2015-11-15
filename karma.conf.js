const config = require('./config.js');
const isparta = require('isparta');
const _ = require('lodash');

const browserify = _.clone(config.browserifyOptions);

browserify.configure = (bundle) => {
  bundle.on('prebundle', () => {
    bundle.external('public/js/common.js');
  });
};

module.exports = (prev) => {
  prev.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'browserify'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/babel-core/browser-polyfill.js',
      config.paths.client.src.test[0],
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/client/**/*.js': ['sourcemap', 'coverage'],
      'test/client/**/*.js': ['browserify', 'sourcemap', 'coverage'],
    },

    browserify: config.browserifyOptions,

    /* babelPreprocessor: {
      options: config.babelOptions.client,
    }, */

    coverageReporter: {
      instrumenters: {
        isparta: isparta,
      },

      instrumenter: {
        'src/client/**.js': 'isparta',
      },

      reporters: [
        {
          type: 'text-summary',
        },
        {
          type: 'html',
          dir: 'public/coverage/',
        },
      ],
    },

    reporters: ['progress'],
    port: 3001,
    colors: true,
    logLevel: prev.LOG_DEBUG,
    autoWatch: true,
    browsers: ['Chrome', 'PhantomJS'],
    singleRun: false,
  });
};
