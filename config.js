const path = require('path');
const babelify = require('babelify');
const conf = __dirname + '/.env';
const fs = require('fs');

if (fs.existsSync(conf)) {
  require('node-env-file')(conf);
} else {
  require('debug')('xeno:env')('No env file found', conf);
}

const debug = (process.env.NODE_ENV === 'development');

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

  paths: {
    vendorRegex: /(node_modules|bower_components)/,

    socket: './node_modules/socket.io/node_modules/socket.io-client/socket.io.js',

    server: {
      entryPoint: 'bin/www',
      src: {
        js: ['src/**/*.js?(x)', '!src/client/**'],
        jade: ['src/views/**/*.jade'],
        test: ['test/**/*.js', '!test/client/**'],
      },
      output: 'dist',
    },

    client: {
      entryPoint: './src/client/app.jsx',
      src: {
        js: ['src/client/**/*.js?(x)'],
        test: ['test/client/**/*.js'],
      },
      compiled: 'app.js',
      output: 'public/js/',
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
  },

  babelOptions: {
    server: {
      optional: ['es7.classProperties', 'runtime'],
      loose: ['es6.classes', 'es6.properties.computed', 'es6.modules', 'es6.forOf'],
    },
    client: {
      optional: ['es7.classProperties', 'runtime'],
      loose: ['es6.classes', 'es6.properties.computed', 'es6.modules', 'es6.forOf'],
      sourceMapRelative: path.join(__dirname, 'public/js'),
    },
  },
};

config.outputs = [
  config.paths.client.output,
  config.paths.server.output,
  config.paths.css.output,
  config.paths.bower.output.font,
];

config.browserifyOptions = Object.assign({
  entries: config.paths.client.entryPoint,
  debug: config.browserifyDebug,
  transform: [babelify.configure(config.babelOptions.client)],
  extensions: ['.jsx'],
  cache: {},
  packageCache: {},
});

module.exports = config;
