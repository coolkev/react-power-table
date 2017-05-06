'use strict';

var webpack = require('webpack');
var path = require('path');

var isDevBuild = process.argv.indexOf('--env.prod') < 0 && process.argv.indexOf('-p') < 0 && process.env.NODE_ENV != 'production';

console.log('isDevBuild=' + isDevBuild);

function prependHotLoader(entry) {

  if (isDevBuild) {
    return [

      'webpack-dev-server/client?http://localhost:8080',
      // bundle the client for webpack-dev-server
      // and connect to the provided endpoint
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      entry
    ];
  }

  return entry;
}


module.exports = {
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
  },

  cache: true,
  //debug: isDevBuild,
  devtool: 'source-map',
  //devtool: false,
  entry: {
    examples: prependHotLoader(path.resolve(__dirname, 'src/boot.tsx'))
  },

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

    // alias: {
    //   'react-power-table': path.resolve(__dirname, '../src/'),

    // }
  },

  module: {

    rules: [
      {
        test: /\.tsx?$/, exclude: /(node_modules)/, use: [
          {
            loader: 'babel-loader', query: {
              "presets": [["latest",
                {
                  "es2015": {
                    "modules": false
                  }
                }]], "plugins": ["react-hot-loader/babel"]
            }
          },
          { loader: 'awesome-typescript-loader', query: { "configFileName": path.resolve(__dirname, "tsconfig.json") } }
        ]
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
    }
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