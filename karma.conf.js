const config = require('./config.js');

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
      'src/public/**/*.js',
      'test/public/**/*.js',
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/client/**/*.js': ['browserify', 'coverage'],
      'test/client/**/*.js': ['browserify', 'coverage'],
    },

    browserify: {
      debug: true,
      transform: [['babelify', config.babelOptions.client]],
    },

    /* babelPreprocessor: {
      options: config.babelOptions.client,
    }, */

    coverageReporter: {
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
    logLevel: prev.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'PhantomJS'],
    singleRun: false,
  });
};
