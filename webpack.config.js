'use strict';

let path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './js/script.js'),
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/js'
  },
  watch: true,

  devtool: "source-map",

  module: {}
};
