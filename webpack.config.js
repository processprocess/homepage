const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
      // {
        // test: /\.(css)$/,
        // loader: "file?name=[path][name].[ext]&context=./app/static"
      // }

    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    stats: 'errors-only'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'philipbell.org',
      template: './src/static/views/index.ejs',
      filename: 'index.html',
      minify: {
        collapseWhitespace: false
      },
      hash: true
    }),
    new HtmlWebpackPlugin({
      title: 'test.org',
      template: 'ejs-render-loader!./src/static/views/project.ejs',
      filename: 'project.html',
      minify: {
        collapseWhitespace: false
      },
      hash: true
    }),
    new CopyWebpackPlugin([
      { from: './src/static/css', to: './css' }
    ]),
    new CopyWebpackPlugin([
      { from: './src/static/images', to: './images' }
    ]),
    new CopyWebpackPlugin([
      { from: './src/static/animations', to: './animations' }
    ])
  ]
}