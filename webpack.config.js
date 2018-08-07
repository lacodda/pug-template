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

const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const parts = require('./webpack.parts');

const lintJSOptions = {
  emitWarning: true,
  // Fail only on errors
  failOnWarning: false,
  failOnError: true,

  // Toggle autofix
  fix: true,
  cache: true,

  formatter: require('eslint-friendly-formatter')
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
  emitErrors: false
  // fix: true,
};

const cssPreprocessorLoader = { loader: 'fast-sass-loader' };

const commonConfig = merge([
  {
    context: paths.app,
    resolve: {
      unsafeCache: true,
      symlinks: false
    },
    entry: `${paths.app}/scripts`,
    output: {
      path: paths.build,
      publicPath: parts.publicPath
    },
    stats: {
      warningsFilter: (warning) => warning.includes('entrypoint size limit'),
      children: false,
      modules: false
    },
    plugins: [
      new HtmlPlugin({
        template: './index.pug'
      }),
      new FriendlyErrorsPlugin(),
      new StylelintPlugin(lintStylesOptions)
    ],
    module: {
      noParse: /\.min\.js/
    }
  },
  parts.loadPug(),
  parts.lintJS({ include: paths.app, options: lintJSOptions }),
  parts.loadFonts({
    include: paths.app,
    options: {
      name: `${paths.fonts}/[name].[hash:8].[ext]`
    }
  })
]);

const productionConfig = merge([
  {
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: 'single'
    },
    output: {
      chunkFilename: `${paths.js}/[name].[chunkhash:8].js`,
      filename: `${paths.js}/[name].[chunkhash:8].js`
    },
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000 // in bytes
    },
    plugins: [
      new StatsWriterPlugin({ fields: null, filename: '../stats.json' }),
      new webpack.HashedModuleIdsPlugin(),
      new ManifestPlugin(),
      new CleanPlugin(paths.build)
    ]
  },
  parts.minifyJS({
    uglifyOptions: {
      parse: {
        // we want uglify-js to parse ecma 8 code. However, we don't want it
        // to apply any minfication steps that turns valid ecma 5 code
        // into invalid ecma 5 code. This is why the 'compress' and 'output'
        // sections only apply transformations that are ecma 5 safe
        // https://github.com/facebook/create-react-app/pull/4234
        ecma: 8
      },
      compress: {
        ecma: 5,
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebook/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false
      },
      mangle: {
        safari10: true
      },
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true
      }
    },
    // Use multi-process parallel running to improve the build speed
    // Default number of concurrent runs: os.cpus().length - 1
    parallel: true,
    // Enable file caching
    cache: true
  }),
  parts.loadJS({
    include: paths.app,
    options: {
      cacheDirectory: true
    }
  }),
  parts.extractCSS({
    include: paths.app,
    use: [parts.autoprefix(), cssPreprocessorLoader],
    options: {
      filename: `${paths.css}/[name].[contenthash:8].css`,
      chunkFilename: `${paths.css}/[id].[contenthash:8].css`
    }
  }),
  parts.purifyCSS({
    paths: glob.sync(`${paths.app}/**/*.+(pug|js)`, { nodir: true }),
    styleExtensions: ['.css', '.scss']
  }),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      }
    }
  }),
  parts.loadSvg({
    include: paths.app,
    options: {
      extract: true,
      spriteFilename: `${paths.svg}/sprite-.[hash:8].svg`,
    }
  }),
  parts.loadImages({
    include: paths.app,
    options: {
      limit: 15000,
      name: `${paths.images}/[name].[hash:8].[ext]`
    }
  }),
  // should go after loading images
  parts.optimizeImages()
]);

const developmentConfig = merge([
  {
    mode: 'development'
  },
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCSS({ include: paths.app, use: [cssPreprocessorLoader] }),
  parts.loadSvg({ include: paths.app }),
  parts.loadImages({ include: paths.app }),
  parts.loadJS({ include: paths.app })
]);

module.exports = (env) => {
  process.env.NODE_ENV = env;

  return merge(
    commonConfig,
    env === 'production' ? productionConfig : developmentConfig
  );
};

function getPaths({
  sourceDir = 'app',
  buildDir = 'dist',
  staticDir = '',
  js = 'scripts',
  images = 'assets/images',
  svg = 'assets/svg',
  fonts = 'assets/fonts',
  css = 'assets/styles'
} = {}) {
  const assets = { svg, images, fonts, js, css };

  return Object.keys(assets).reduce(
    (obj, assetName) => {
      const assetPath = assets[assetName];

      obj[assetName] = !staticDir ? assetPath : `${staticDir}/${assetPath}`;

      return obj;
    },
    {
      app: path.join(__dirname, sourceDir),
      build: path.join(__dirname, buildDir),
      staticDir
    }
  );
}