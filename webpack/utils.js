const fs = require('fs');
const { join, resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

exports.getPaths = ({
  root = '..',
  src = 'src',
  dist = 'dist',
  entry = {},
  pages = '',
  assets = {},
} = {}) => {
  // Define root dir
  root = resolve(join(__dirname, root));
  // Define source dir
  src = resolve(join(root, src));
  // Define dist dir
  dist = resolve(join(root, dist));
  // Define pages dir
  pages = resolve(join(src, pages));

  entry = Object.keys(entry).reduce(
    (obj, name) => {
      obj[name] = resolve(join(src, entry[name]));

      return obj;
    },
    {},
  );

  return Object.keys(assets).reduce(
    (obj, name) => {
      const assetSrc = assets[name].hasOwnProperty('src')
        ? assets[name].src
        : assets[name];
      const assetDist = assets[name].hasOwnProperty('dist')
        ? assets[name].dist
        : assets[name];

      obj[name] = {
        src: resolve(join(src, assetSrc)),
        dist: assetDist,
      };

      return obj;
    },
    {
      root,
      src,
      dist,
      entry,
      pages,
    },
  );
};

// Our function that generates our html plugins
exports.generateHtmlPlugins = (templateDir) => {
  // Read files in template directory
  const templateFiles = fs.readdirSync(resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    // Split names and extension
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    // Create new HTMLWebpackPlugin with options
    return new HTMLWebpackPlugin({
      filename: `${name}.html`,
      template: resolve(__dirname, `${templateDir}/${name}.${extension}`),
    });
  });
};
