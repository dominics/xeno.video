const path = require('path');
const babelify = require('babelify');
const fs = require('fs');
const loadConfiguration = require('./dist/config');

loadConfiguration();

const debug = (process.env.NODE_ENV === 'development');
const output = path.join(__dirname, 'build');

const nodeOptions = [];

if (process.env.DEBUG_PORT) {
  nodeOptions.push(`--debug=${process.env.DEBUG_PORT}`);
  nodeOptions.push('--nolazy');
}

const config = {
  debug: debug,
  linting: debug,
  sourcemap: debug,
  compress: !debug,
  browserifyDebug: debug,

  node: `${process.execPath} ${nodeOptions.join(' ')}`,
  nodeOptions: nodeOptions,
  vendorRegex: /(node_modules|bower_components)/,

  socket: './node_modules/socket.io-client/socket.io.js',

  build: {
    output: output,
    lcov:   output,
  },

  server: {
    entryPoint: 'bin/www',
    src: {
      js: ['src/**/*.js?(x)'], // We include the client-side code, so we can unit-test it server-side
      jade: ['src/views/**/*.jade'],
    },
    output: 'dist',
  },

  client: {
    entryPoint: './src/client/app.jsx',
    src: {
      js: ['src/client/**/*.js?(x)'],
    },
    compiled: 'app.js',
    output: 'public/js/',
  },

  test: {
    src: ['test/**/*.js', '!test/fixture/**/*'],
    output: 'dist-test',
    tests: 'dist-test/**/*.spec.js',
    bootstrap: './dist-test/bootstrap.js',
    coverage: 'dist/**/*.js',
  },

  bower: {
    src: 'bower_components',
    compiled: 'common.js',
    output: {
      js: 'public/js/',
      font: 'public/fonts',
    },
    overrides: {
      'bootstrap-sass': {
        main: [
          './assets/javascripts/bootstrap.js',
          './assets/fonts/bootstrap/*',
        ],
      },
      'font-awesome': {
        main: [
          './fonts/*',
        ],
      },
    },
  },

  css: {
    entryPoint: 'src/scss/style.scss',
    src: {
      scss: ['src/scss/**/*.scss'],
    },
    output: 'public/css',
  },

  babelOptions: {
    server: {
      optional: ['es7.classProperties', 'runtime'],
      loose: ['es6.classes', 'es6.properties.computed', 'es6.modules', 'es6.forOf'],
    },
    client: {
      optional: debug
        ? ['es7.classProperties', 'runtime']
        : ['es7.classProperties', 'runtime', 'optimisation.react.inlineElements', 'optimisation.react.constantElements'],
      loose: ['es6.classes', 'es6.properties.computed', 'es6.modules', 'es6.forOf'],
      sourceMapRelative: path.join(__dirname, 'public/js'),
    },
  },

  karma: {},
};

config.karma.browsers = process.env.TEST_USE_CHROME !== '1' ? ['PhantomJS'] : ['PhantomJS', 'Chrome'];

config.outputs = [
  config.client.output,
  config.server.output,
  config.css.output,
  config.bower.output.font,
];

config.browserifyOptions = Object.assign({
  entries: config.client.entryPoint,
  debug: config.browserifyDebug,
  transform: [babelify.configure(config.babelOptions.client)],
  extensions: ['.jsx'],
  cache: {},
  packageCache: {},
});

module.exports = config;
