#!/usr/bin/env node

const { readFileSync } = require('fs');
const { resolve } = require('path');
const serve = require('webpack-serve');
const config = require('./webpack.dev');

const argv = {};
const env = process.env.NODE_ENV;

serve(argv, {
  ...config(env),
  open: 'chrome',
  clipboard: false,
  port: 8888,
  http2: true,
  https: {
    key: readFileSync(resolve(__dirname, '../ssl/ssl.key')),
    cert: readFileSync(resolve(__dirname, '../ssl/ssl.crt')),
  },
});
