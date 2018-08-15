module.exports = {
  root: '..',
  src: 'src',
  dist: 'dist',
  entry: {
    app: 'js/index.js',
  },
  pages: 'templates/pages',
  assets: {
    js: {
      src: 'js',
      dist: 'assets/js',
    },
    css: {
      src: 'scss',
      dist: 'assets/css',
    },
    img: 'assets/images',
    svg: {
      src: 'assets/svg',
      dist: 'assets/images',
    },
    fonts: {
      src: 'assets/fonts',
      dist: 'assets/fonts',
    },
  },
};
