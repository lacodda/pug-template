const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const common = require('./webpack.common.js');
const parts = require('./webpack.parts');
const { getPaths } = require('./utils');
const config = require('./config');

const paths = getPaths(config);

module.exports = merge(
  common,
  {
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: 'single',
    },
    output: {
      filename: `${paths.js.dist}/[name].[chunkhash:8].js`,
      chunkFilename: `${paths.js.dist}/[name].[chunkhash:8].js`,
    },
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
    plugins: [
      new StatsWriterPlugin({ fields: null, filename: '../stats.json' }),
      new webpack.HashedModuleIdsPlugin(),
      new ManifestPlugin(),
      new CleanPlugin(paths.dist),
    ],
  },
  parts.minifyJS({
    uglifyOptions: {
      parse: {
        // we want uglify-js to parse ecma 8 code. However, we don't want it
        // to apply any minfication steps that turns valid ecma 5 code
        // into invalid ecma 5 code. This is why the 'compress' and 'output'
        // sections only apply transformations that are ecma 5 safe
        // https://github.com/facebook/create-react-app/pull/4234
        ecma: 8,
      },
      compress: {
        ecma: 5,
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebook/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true,
      },
    },
    // Use multi-process parallel running to improve the build speed
    // Default number of concurrent runs: os.cpus().length - 1
    parallel: true,
    // Enable file caching
    cache: true,
  }),
  parts.loadJS({
    include: paths.js.src,
    options: {
      cacheDirectory: true,
    },
  }),
  parts.extractCSS({
    include: paths.css.src,
    use: [parts.autoprefix(), parts.cssPreprocessorLoader],
    options: {
      filename: `${paths.css.dist}/[name].[contenthash:8].css`,
      chunkFilename: `${paths.css.dist}/[id].[contenthash:8].css`,
    },
  }),
  parts.purifyCSS({
    paths: glob.sync(`${paths.src}/**/*.+(pug|js)`, { nodir: true }),
    styleExtensions: ['.css', '.scss'],
  }),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
    },
  }),
  parts.loadImages({
    include: paths.img.src,
    options: {
      limit: 15000,
      name: `${paths.img.dist}/[name].[hash:8].[ext]`,
    },
  }),
  // should go after loading images
  // FIXME: images are encoded in base64 with "optimizeImages"
  // parts.optimizeImages(),
);
