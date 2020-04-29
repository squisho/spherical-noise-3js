const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  devtool: 'inline-source-map',
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: false // was running 2 apps simultaneously, this prevents that.
    })
  ]
};
