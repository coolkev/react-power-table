'use strict';

var webpack = require('webpack');
var path = require('path');

var isDevBuild = process.argv.indexOf('--env.prod') < 0 && process.argv.indexOf('-p') < 0;

module.exports = {
  output: {
    path: path.resolve('./dist/'),        
    filename: isDevBuild ? '[name].js' : '[name].min.js',
    //publicPath: '/dist/',
   // libraryTarget: "var",
    // name of the global var: "Foo"
    library: "ReactPowerTable",
    libraryTarget: 'umd'
  },

  cache: isDevBuild,
  //debug: isDevBuild,
  devtool: isDevBuild ? 'source-map"' : false,
  //devtool: false,
  entry: { index: './src/index.ts' },

  stats: {
    colors: true,
    reasons: isDevBuild
  },

  plugins: isDevBuild ? [
      
      new webpack.HotModuleReplacementPlugin(),

      new webpack.NamedModulesPlugin()
  ] :
    [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    //  new webpack.optimize.CommonsChunkPlugin({
    //     //name: 'vendor',
    //     names: ['vendor'],
    //     minChunks: function (module) {
    //       // this assumes your vendor imports exist in the node_modules directory
    //       return module.context && module.context.indexOf('node_modules') !== -1;
    //     }
    //   })    
  ],

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.png', '.ts', '.tsx']
  },

  module: {

    rules: [
      {
        test: /\.tsx?$/, exclude: /(node_modules)/, use: [
          { loader: 'babel-loader', query: { "presets": [["es2015", { "modules": false }]] } },
          { loader: 'awesome-typescript-loader' }]
      },

      { test: /\.css(\?|$)/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },

      // {
      //   test: /\.png$/,
      //   use: [{ loader: "url-loader", query: { mimetype: "image/png" } }],

      // }
    ]
  },
  externals: ["react", 'react-dom',/^fbjs\//,'react-bootstrap', /^react-bootstrap\//,'react-select','react-select/lib/Value','react-bootstrap-date-picker','classnames'],
 
};
