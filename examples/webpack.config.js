'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
   context: __dirname,
  output: {
    path: path.resolve(__dirname,'dist'),        
    filename: '[name].js',
    publicPath: '/dist/',
  },

  cache: true,
  //debug: isDevBuild,
  devtool: 'source-map',
  //devtool: false,
  entry: { examples: path.resolve(__dirname,'src/index.tsx') },

  stats: {
    colors: true,
  },

  plugins: [
      
      new webpack.HotModuleReplacementPlugin(),

      new webpack.NamedModulesPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
        //name: 'vendor',
        names: ['vendor'],
        minChunks: function (module) {
          // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      })    
  ],

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.png', '.ts', '.tsx'],

    alias: {
      'react-power-table': path.resolve(__dirname,'../dist/'),
  
    }
  },

  module: {

    rules: [
      { test: /\.tsx?$/, exclude: /(node_modules)/, use: [
        { loader: 'awesome-typescript-loader', query: { "configFileName": path.resolve(__dirname,"tsconfig.json") } }

      ] },

      { test: /\.css(\?|$)/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },

    ]
  },
  devServer: {
    hot: true,
    // enable HMR on the server

    port: 8080,

    contentBase: './examples/',
    // match the output path

    publicPath: '/dist/'
    // match the output `publicPath`
  }
};

// module.exports = function () {
//   return {
//     output: {
//       filename: 'examples.js'
//     },

//     //devtool: false,
//     entry: './examples/index.tsx',

//     resolve: {
//       extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.png', '.ts', '.tsx']
//     },

//     module: {

//       rules: [
//         {
//           test: /\.tsx?$/, exclude: /(node_modules)/, use: ['awesome-typescript-loader']
//         }

//       ]
//     },

     
//   };
// };