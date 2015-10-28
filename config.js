const path = require('path');
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

    server: {
      entryPoint: 'bin/www',
      src: {
        js: ['src/**/*.js?(x)', '!src/client/**'],
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

    bower: 'bower_components',

    css: {
      src: {
        scss: ['src/scss/style.scss'],
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
];

module.exports = config;
