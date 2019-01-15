'use strict';

var webpack = require('webpack');
var path = require('path');
var ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
//var HappyPack = require('happypack');

var isDevBuild = process.argv.indexOf('--env.prod') < 0 && process.argv.indexOf('-p') < 0 && process.env.NODE_ENV != 'production';

console.log('isDevBuild=' + isDevBuild);
console.log('config file=' + path.resolve(__dirname, "tsconfig.json"));

function prependHotLoader(entry) {

  if (isDevBuild) {
    return [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      // bundle the client for webpack-dev-server
      // and connect to the provided endpoint
      'webpack/hot/only-dev-server',

      entry
    ];
  }

  return ['babel-polyfill', entry];
}


var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
   new webpack.HotModuleReplacementPlugin(),

  // new webpack.NamedModulesPlugin(),
  // new webpack.optimize.CommonsChunkPlugin({
  //   //name: 'vendor',
  //   names: ['vendor'],
  //   minChunks: function (module) {
  //     // this assumes your vendor imports exist in the node_modules directory
  //     return module.context && module.context.indexOf('node_modules') !== -1;
  //   }
  // }),
  //new ForkTsCheckerWebpackPlugin(),
  new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true
  }),
  //new ForkTsCheckerNotifierWebpackPlugin({ excludeWarnings: true, skipSuccessful: true }),

  // new HappyPack({
  //   id: 'ts',
  //   threads: 2,
  //   loaders: [
  //     {
  //       loader: 'babel-loader', query: {
  //         "presets": [["env", {
  //           "modules": false
  //         }
  //         ],
  //           "react"
  //         ], "plugins": ["react-hot-loader/babel"]
  //       }
  //     },
  //     {
  //       path: 'ts-loader',
  //       query: { happyPackMode: true }
  //     },
  //   ]
  // }),
];

if (!isDevBuild) {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      //sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
    })]);
}

module.exports = {
  mode: isDevBuild ? "none" : "production",
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

  plugins: plugins,

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
          //{ loader: 'awesome-typescript-loader', query: { "configFileName": path.resolve(__dirname, "tsconfig.json") } }
          // {
          

          //   loader: 'babel-loader', query: {
          //     "presets": [["env", {
          //       "modules": false
          //     },
          //     ]], "plugins": ["react-hot-loader/babel"]
          //   }
          // },
          // {
          //   loader: 'ts-loader',
          //   options: {
          //     // disable type checker - we will use it in fork plugin
          //     transpileOnly: true,

          //   }
          // },
          {
            loader: 'babel-loader',
            options: {
                presets: [["env",
                    {
                        modules: false,

                    }]],
                cacheDirectory: true,
                babelrc: false,
                plugins: isDevBuild ? ['react-hot-loader/babel'] : [],
            },
        },
        {
            loader: "ts-loader",
            options: {

                //configFile: isDevBuild ? 'tsconfig.dev.json' : undefined,
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,

            },
        },

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
    },

    stats: {
      colors: true
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