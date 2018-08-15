const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const parts = require('./webpack.parts');
const { getPaths } = require('./utils');
const config = require('./config');

const paths = getPaths(config);

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
    include: paths.css.src,
    use: [parts.autoprefix(), parts.cssPreprocessorLoader],
  }),
  parts.loadImages({ include: paths.img.src }),
  parts.loadJS({ include: paths.js.src }),
);
