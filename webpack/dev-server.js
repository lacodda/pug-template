#!/usr/bin/env node

const { readFileSync } = require('fs');
const { resolve } = require('path');
const serve = require('webpack-serve');
const config = require('../webpack.config');

const argv = {};
const env = process.env.NODE_ENV;
console.log(config(env));
console.log(env);

serve(argv, {
  ...config(env),
  open: 'chrome',
  clipboard: false
  // port: 8888,
  // http2: true,
  // https: {
  //   key: readFileSync(resolve(__dirname, '../ssl/ssl.key')),
  //   cert: readFileSync(resolve(__dirname, '../ssl/ssl.crt')),
  // },
}).then((server) => {
  server.on('listening', ({ serv, opt }) => {
    console.log('happy fun time');
  });
});
