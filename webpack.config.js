/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = "development";

const server = {
  mode,
  target: "node",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "./dist/server"),
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js'
    ],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
                decorators: true,
              }
            }
          }
        }
      }
    ]
  }
};

const client = {
  mode,
  entry: "./src/client/app.jsx",
  output: {
    path: path.resolve(__dirname, "./dist/client"),
    publicPath: '/',
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js'
    ],
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.m?[jt]sx?$/,
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: "swc-loader"
        }
      }
    ]
  }
};

module.exports = [server, client];
