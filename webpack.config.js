var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',

  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080/',
      'webpack/hot/only-dev-server',
      path.join(__dirname, '/src/index.jsx'),
    ],
    vendor: ['react', 'react-dom'],
  },

  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.styl$/, loaders: [
        'style?sourceMap',
        'css?modules&importLoaders=1&localIdentName=[local]__[hash:base64:5]',
        'stylus-loader',
      ],
      },
      // { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=assets/fonts/[name].[ext]' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=assets/fonts/[name].[ext]' }
      // { test: /\.(eot|svg|ttf|woff|woff2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=100000&name=assets/fonts/[name].[ext]' }
    ],
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.tmpl.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.bundle.js'),
    new webpack.DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],

  devServer: {
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true,
  },
};
