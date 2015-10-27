const path = require('path');
const conf = __dirname + '/.env';
const fs = require('fs');

if (fs.existsSync(conf)) {
  require('node-env-file')(conf);
} else {
  gutil.log('No env file found', conf);
}

const debug = (process.env.NODE_ENV === 'development');

const nodeOptions = [];

if (process.env.DEBUG_PORT) {
  nodeOptions.push(`--debug=${process.env.DEBUG_PORT}`);
  nodeOptions.push('--nolazy');
}

const config = {
  debug:           debug,
  linting:         debug,
  sourcemap:       debug,
  compress:        !debug,
  browserifyDebug: debug,

  node: `${process.execPath} ${nodeOptions.join(' ')}`,
  nodeOptions: nodeOptions,

  paths: {
    vendorRegex: /(node_modules|bower_components)/,

    server: {
      entryPoint: 'bin/www',
      src:        {
        js:   ['src/**/*.js', 'src/*.js', '!src/client/**'],
        jsx:  ['src/**/*.jsx'],
        jade: ['src/views/**/*.jade'],
      },
      output:     'dist',
    },

    client: {
      entryPoint: './src/client/app.jsx',
      src:        {
        js:  ['src/client/**/*.js'],
        jsx: ['src/client/**/*.jsx'],
      },
      compiled:   'app.js',
      output:     'public/js/',
    },

    bower: 'bower_components',

    css: {
      src:    {
        scss: ['src/scss/style.scss'],
      },
      output: 'public/css',
    },
  },

  babelOptions: {
    server: {
      optional: ['es7.classProperties'],
    },
    client: {
      optional:          ['es7.classProperties'],
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
