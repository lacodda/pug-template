const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const parts = require('./webpack.parts');
const { getPaths } = require('./utils');

const paths = getPaths();

module.exports = merge(
  common,
  {
    mode: 'development',
    devtool: 'inline-source-map',
  },
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS({
    include: paths.app,
    use: [parts.autoprefix(), parts.cssPreprocessorLoader],
  }),
  parts.loadImages({ include: paths.app }),
  parts.loadJS({ include: paths.app }),
);
