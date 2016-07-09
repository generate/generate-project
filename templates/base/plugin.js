---
rename:
  basename: 'index.js'
install:
  devDependencies: ['is-valid-app']
---
'use strict';

var isValid = require('is-valid-app');

module.exports = function(options) {
  return function(app) {
    if (!isValid(app, '<%= name %>')) return;
  }
};
