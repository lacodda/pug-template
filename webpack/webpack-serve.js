#!/usr/bin/env node

const { readFileSync } = require('fs');
const { join, resolve } = require('path');
// const serve = require('webpack-serve');
// const config = require('./webpack.dev');

// const argv = {};
// const env = process.env.NODE_ENV;

// serve(argv, {
//   ...config(env),
//   open: 'chrome',
//   clipboard: false,
//   port: 8888,
//   http2: true,
//   https: {
//     key: readFileSync(resolve(__dirname, '../ssl/ssl.key')),
//     cert: readFileSync(resolve(__dirname, '../ssl/ssl.crt')),
//   },
// });
const conf = require('./config');
const conf2 = {};

Object.prototype.isEmpty = () => {
  for (let key in this) {
    return !this.hasOwnProperty(key);
  }
  return true;
}

const getPaths = ({
  root = '..',
  source = 'src',
  dist = 'dist',
  assets = {},
} = {}) => {
  // Define root dir
  root = resolve(join(__dirname, root));
  // Define source dir
  source = resolve(join(root, source));
  // Define dist dir
  dist = resolve(join(root, dist));

  if (assets.isEmpty()) {
    return {
      root,
      source,
      dist,
    };
  }

  return Object.keys(assets).reduce(
    (obj, name) => {
      let asset;
      if(assets[name] instanceof Object && !assets[name].isEmpty()){
        asset = 0;
      } else {
        asset = assets[name];
      }
      const assetSource = assets[name].hasOwnProperty('source') ? assets[name].source : assets[name];
       
      obj[name] = assetPath;

      return obj;
    },
    {
      root,
      source,
      dist,
    },
  );
};

console.log(conf);
console.log('================================');
console.log(getPaths(conf));
console.log('================================');
console.log(getPaths(conf2));
