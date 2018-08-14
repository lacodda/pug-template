const { join, resolve } = require('path');

module.exports = () => ({
  root: resolve(join(__dirname, '..')),
  source: 'src',
  dist: 'dist',
  static: '',
  js: 'js',
  assets: {
    styles: {
      source: 'scss',
      dist: 'css',
    },
    images: 'images',
    svg: {
      source: 'svg',
      dist: 'images',
    },
  },
});
