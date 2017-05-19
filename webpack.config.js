const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const folderPath = glob.sync(__dirname + '/src/static/views');
const pages = glob.sync(__dirname + '/src/static/views/*.ejs');

// One bundle for each page
// One bundle for type of page

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
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   use: [
      //     'file-loader?name=images/[name].[ext]',
      //     'image-webpack-loader'
      //   ]
      // }
      // {
      //   test: /\.(css)$/,
      //   loader: "file?name=[path][name].[ext]&context=./app/static"
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

    ...(function(){
      return ejsPages = pages.map(page => {
        let fileName = page.split('/').pop().replace('.ejs', '.html')
        let inject = true;
        if(fileName !== 'index.html') inject = false
        return new HtmlWebpackPlugin({
          title: 'PB',
          template: `ejs-render-loader!${page}`,
          filename: fileName,
          minify: {
            collapseWhitespace: true
          },
          inject: inject,
          hash: true
        })
      })
    })(),

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