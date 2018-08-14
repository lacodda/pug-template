const path = require('path');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { getPaths, generateHtmlPlugins } = require('./utils');
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
     sourceDir - 'src',
      buildDir - 'dist',
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

// Call our function on our views directory.
const htmlPlugins = generateHtmlPlugins('../src/templates/pages');

module.exports = merge([
  {
    context: paths.app,
    resolve: {
      unsafeCache: true,
      symlinks: false,
    },
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
      ...htmlPlugins,
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
  // parts.extractSvg({
  //   include: paths.app,
  //   options: {
  //     extract: true,
  //     spriteFilename: `${paths.svg}/sprite.[hash:8].svg`,
  //     esModule: false,
  //   },
  // }),
  parts.loadSvg(),
]);
