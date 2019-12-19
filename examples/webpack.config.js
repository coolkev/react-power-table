'use strict';

var webpack = require('webpack');
var path = require('path');

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  //new webpack.HotModuleReplacementPlugin(),

  //new webpack.NamedModulesPlugin(),
];


module.exports = {
  mode: "none",
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
  },
  
  cache: true,
  devtool: 'source-map',
  entry: {
    examples: ["react-hot-loader/patch", path.resolve(__dirname, 'src/boot.tsx')]
  },

  stats: {
    colors: true,
  },

  plugins: plugins,

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.png', '.ts', '.tsx'],
    alias: {
      "react-dom": "@hot-loader/react-dom"
    },
  },

  module: {

    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },
      { test: /\.css(\?|$)/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },

    ]
  },
  devServer: {
    hot: true,
    // enable HMR on the server

    port: 8080,

    contentBase: './examples/',
    // match the output path

    publicPath: '/dist/',
    // match the output `publicPath`

    proxy: {
      "/api": "http://localhost:57050/"
    },

    stats: {
      colors: true
    }
  }
};
