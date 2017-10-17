'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var generate = require('generate');
var npm = require('npm-install-global');
var del = require('delete');
var generator = require('..');
var app;

var actual = path.resolve.bind(path, __dirname, 'actual');

function exists(name, cb) {
  return function(err) {
    if (err) return cb(err);
    var filepath = actual(name);
    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      assert(stat);
      del(actual(), cb);
    });
  };
}

describe('plugins', function() {
  this.slow(350);

  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('generate', cb);
    });
  }

  before(function(cb) {
    del(actual(), cb);
  });

  beforeEach(function() {
    app = generate({silent: true});
    app.cwd = actual();
    app.option('dest', actual());
    app.option('prompt', false);
    app.option('askWhen', 'not-answered');
    app.option('check-directory', false);
    app.use(require('verb-repo-data'));
    app.use(generator);
  });

  describe('editorconfig', function() {
    it('should run the `editorconfig` task with .build', function(cb) {
      app.generate('editorconfig', exists('.editorconfig', cb));
    });

    it('should run the `editorconfig` task with .generate', function(cb) {
      app.generate('editorconfig', exists('.editorconfig', cb));
    });
  });

  describe('eslint', function() {
    it('should run the `eslint` task with .build', function(cb) {
      app.generate('eslint:eslintrc', exists('.eslintrc.json', cb));
    });

    it('should run the `eslint` task with .generate', function(cb) {
      app.generate('eslint', exists('.eslintrc.json', cb));
    });
  });

  describe('license', function() {
    it('should run the `mit` task with .build', function(cb) {
      app.generate('license:mit', exists('LICENSE', cb));
    });

    it('should run the `mit` task with .generate', function(cb) {
      app.generate('license:mit', exists('LICENSE', cb));
    });
  });

  describe('package', function() {
    it('should run the `package` task with .build', function(cb) {
      app.generate('package', exists('package.json', cb));
    });

    it('should run the `package` task with .generate', function(cb) {
      app.generate('package', exists('package.json', cb));
    });
  });

  describe('travis', function() {
    it('should run the `travis` task with .build', function(cb) {
      app.generate('travis', exists('.travis.yml', cb));
    });

    it('should run the `travis` task with .generate', function(cb) {
      app.generate('travis', exists('.travis.yml', cb));
    });
  });
});
