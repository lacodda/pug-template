const path = require('path');

exports.getPaths = function ({
  sourceDir = 'src',
  buildDir = 'dist',
  staticDir = '',
  js = 'js',
  images = 'assets/images',
  svg = 'assets/svg',
  fonts = 'assets/fonts',
  css = 'assets/styles',
} = {}) {
  const assets = { svg, images, fonts, js, css };

  return Object.keys(assets).reduce(
    (obj, assetName) => {
      const assetPath = assets[assetName];

      obj[assetName] = !staticDir ? assetPath : `${staticDir}/${assetPath}`;

      return obj;
    },
    {
      app: path.join(__dirname, '..', sourceDir),
      build: path.join(__dirname, '..', buildDir),
      staticDir,
    },
  );
};
