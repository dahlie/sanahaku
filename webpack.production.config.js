var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
  entry: {
    app: __dirname + "/src/index.jsx",
    vendor: ['react', 'react-dom']
  },

  output: {
    path: __dirname + "/build",
    filename: "[name]-[hash].js"
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.styl$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[local]__[hash:base64:5]!stylus-loader') },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=assets/fonts/[name].[ext]" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=assets/fonts/[name].[ext]" }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/src/index.tmpl.html"
    }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor-[hash].js"),
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin("[name]-[hash].css"),
    new webpack.DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "zopfli",
        test: /\.js$|\.html$/,
        minRatio: 0.8
    })
  ]
}
