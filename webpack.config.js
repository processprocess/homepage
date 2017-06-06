const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    'index': './src/index.js',
    'lazerGlazer': './src/lazerGlazer.js'
  },
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
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Bell86',
      template: `ejs-render-loader!./src/static/views/index.ejs`,
      chunks: ['index'],
      filename: 'index.html',
      inject: true,
      hash: true
    }),
    new HtmlWebpackPlugin({
      title: 'Bell86',
      template: `ejs-render-loader!./src/static/views/lazerGlazer.ejs`,
      chunks: ['lazerGlazer'],
      filename: 'lazerGlazer.html',
      inject: true,
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
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    stats: 'errors-only'
  }
}