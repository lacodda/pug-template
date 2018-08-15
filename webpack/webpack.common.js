const { resolve } = require('path');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { getPaths, generateHtmlPlugins } = require('./utils');
const parts = require('./webpack.parts');
const config = require('./config');

const paths = getPaths(config);

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

const lintStylesOptions = {
  context: paths.css.src,
  syntax: 'scss',
  emitErrors: false,
  // fix: true,
};

// Find all pages on pages directory
const htmlPlugins = generateHtmlPlugins(paths.pages);

module.exports = merge([
  {
    context: paths.src,
    resolve: {
      unsafeCache: true,
      symlinks: false,
    },
    entry: paths.entry,
    output: {
      path: paths.dist,
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
  parts.lintJS({ include: paths.js.src, options: lintJSOptions }),
  parts.loadFonts({
    include: paths.fonts.src,
    options: {
      name: `${paths.fonts.dist}/[name].[hash:8].[ext]`,
    },
  }),
  // parts.extractSvg({
  //   include: paths.app,
  //   options: {
  //     extract: true,
  //     spriteFilename: `${paths.svg.src}/sprite.[hash:8].svg`,
  //     esModule: false,
  //   },
  // }),
  parts.loadSvg(),
]);
