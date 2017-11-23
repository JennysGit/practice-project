var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var webpackCfg = require('./webpack.config.build.js');

var compiler = webpack(webpackCfg);

var server = new WebpackDevServer(compiler, {
  // webpack-dev-server options
  contentBase: path.join(__dirname, "dist"),
  hot: true,
  historyApiFallback: false,
  compress: true,
  proxy: {
    "**": "http://localhost:8080"
  },
  clientLogLevel: "info",
  // webpack-dev-middleware options
  quiet: false,
  noInfo: false,
  lazy: true,
  filename: "bundle.js",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  // It's a required option.
  publicPath: "/assets/",
  headers: { "X-Custom-Header": "yes" },
  stats: { colors: true }
});
server.listen(8080, "localhost", function() {});