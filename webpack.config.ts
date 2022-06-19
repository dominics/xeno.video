import * as path from "path";
import * as webpack from "webpack";

const mode = "development";

const server: webpack.Configuration = {
  mode,
  target: "node",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
  },
};

const client: webpack.Configuration = {
  mode,
  entry: "./src/client/app.jsx",
  output: {
    path: path.resolve(__dirname, "./public/js"),
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
};

const config = [server, client];
export default config;
