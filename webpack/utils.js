const fs = require('fs');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

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

// Our function that generates our html plugins
exports.generateHtmlPlugins = function (templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    // Split names and extension
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    // Create new HTMLWebpackPlugin with options
    return new HTMLWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
    });
  });
};
