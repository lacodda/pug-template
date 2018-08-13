// const { resolve, join } = require('path');

// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const merge = require('webpack-merge');
// const babel = require('./webpack/modules/babel');
// const pug = require('./webpack/modules/pug');
// const devServer = require('./webpack/modules/devserver');
// const style = require('./webpack/modules/style');
// const styleExtract = require('./webpack/modules/style.extract');
// const uglifyJs = require('./webpack/modules/js.uglify');
// const images = require('./webpack/modules/images');
// const svg = require('./webpack/modules/svg');
// const html = require('./webpack/modules/html');
// const fonts = require('./webpack/modules/fonts');
// const favicons = require('./webpack/modules/favicons');

// const PATHS = {
//   source: join(__dirname, 'src'),
//   build: join(__dirname, 'build'),
// };

// const env = process.env.NODE_ENV;
// const minify = env === 'production';
// const sourceMap = env === 'development';

// const alias = (dir = '') => resolve(join(__dirname, dir));
// const assetsPath = (dir = '') => path.posix.join('static', dir);
// const createLintingRule = () => ({
//   test: /\.(js|vue)$/,
//   loader: 'eslint-loader',
//   enforce: 'pre',
//   include: [alias('src'), alias('test')],
//   exclude: [alias('src/tests')],
//   options: {
//     formatter: require('eslint-friendly-formatter'),
//     emitWarning: true,
//   },
// });

// const common = merge([
//   {
//     stats: {
//       colors: true,
//       version: true,
//     },
//     entry: {
//       index: alias('src/js/index.js'),
//     },
//     output: {
//       path: PATHS.build,
//       filename: 'js/[name].js',
//     },
//     plugins: [
//       new HtmlWebpackPlugin({
//         filename: 'index.html',
//         chunks: ['index', 'common'],
//         template: PATHS.source + '/templates/index.pug',
//       }),
//       // new webpack.optimize.splitChunks({
//       //   name: 'common',
//       // }),
//       new CopyWebpackPlugin([
//         {
//           from: PATHS.source + '/static',
//           to: PATHS.build + '/static',
//         }]),
//     ],
//   },
//   babel(),
//   pug(),
//   images(),
//   // svg(),
//   html(),
//   fonts(),
// ]);

// module.exports = function (env) {
//   if (env === 'production') {
//     return merge([
//       common,
//       favicons,
//       styleExtract(),
//       // uglifyJs(),
//     ]);
//   }
//   if (env === 'development') {
//     return merge([
//       common,
//       devServer(),
//       style(),
//     ]);
//   }
// };

const path = require('path');
const merge = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const { getPaths } = require('./utils');

const parts = require('./webpack.parts');

const lintJSOptions = {
  emitWarning: true,
  // Fail only on errors
  failOnWarning: false,
  failOnError: true,

  // Toggle autofix
  fix: true,
  cache: true,

  formatter: require('eslint-friendly-formatter'),
};

/*
  To move all assets to some static folder
  getPaths({ staticDir: 'some-name' })

  To rename asset build folder
  getPaths({ js: 'some-name' })

  To move assets to the root build folder
  getPaths({ css: '' })

  Defaults values:
     sourceDir - 'app',
      buildDir - 'build',
     staticDir - '',

        images - 'images',
         fonts - 'fonts',
           css - 'styles',
            js - 'scripts'
*/
const paths = getPaths();

const lintStylesOptions = {
  context: path.resolve(__dirname, `${paths.app}/styles`),
  syntax: 'scss',
  emitErrors: false,
  // fix: true,
};

module.exports = merge([
  {
    context: paths.app,
    resolve: {
      unsafeCache: true,
      symlinks: false,
    },
    // entry: path.resolve(paths.app, 'js', 'index.js'),
    // entry: './js/index.js',
    entry: {
      app: './js/index.js',
    },
    output: {
      path: paths.build,
      publicPath: parts.publicPath,
    },
    stats: {
      warningsFilter: warning => warning.includes('entrypoint size limit'),
      children: false,
      modules: false,
    },
    plugins: [
      new HtmlPlugin({
        template: './index.pug',
      }),
      new FriendlyErrorsPlugin(),
      new StylelintPlugin(lintStylesOptions),
    ],
    module: {
      noParse: /\.min\.js/,
    },
  },
  parts.loadPug(),
  parts.lintJS({ include: paths.app, options: lintJSOptions }),
  parts.loadFonts({
    include: paths.app,
    options: {
      name: `${paths.fonts}/[name].[hash:8].[ext]`,
    },
  }),
  // parts.loadSvg({
  //   include: paths.app,
  //   options: {
  //     extract: true,
  //     spriteFilename: `${paths.svg}/sprite.[hash:8].svg`,
  //     esModule: false,
  //   },
  // }),
  parts.loadSvg(),
]);
