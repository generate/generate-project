'use strict';

var isTravis = process.env.CI || process.env.TRAVIS;
require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var generate = require('generate');
var isValid = require('is-valid-app');
var npm = require('npm-install-global');
var del = require('delete');
var pkg = require('../package');
var generator = require('..');
var app;

var cwd = path.resolve.bind(path, process.cwd());
var tests = path.resolve.bind(path, __dirname);
var actual = path.resolve.bind(path, __dirname, 'actual');

function exists(name, cb) {
  return function(err) {
    if (err) return cb(err);
    fs.stat(actual(name), cb);
  };
}

describe('generate-project', function() {
  this.slow(350);

  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('generate', cb);
    });
  }

  before(function(cb) {
    del([tests('actual'), tests('trees')], cb);
  });

  after(function(cb) {
    del([tests('actual'), tests('trees')], cb);
  });

  beforeEach(function() {
    app = generate({silent: true});
    app.cwd = actual();

    // pre-populate template data to avoid prompts from `ask` helper
    app.option('askWhen', 'not-answered');
    app.option('dest', actual());
    app.option('trees', cwd('test/trees'));
    app.option('overwrite', function(file) {
      return /actual/.test(file.path);
    });
  });

  describe('tasks', function() {
    it('should extend tasks onto the instance', function() {
      app.use(generator);
      assert(app.tasks.hasOwnProperty('default'));
      assert(app.tasks.hasOwnProperty('package'));
    });

    it('should run the `default` task with .build', function(cb) {
      app.use(generator);
      app.build(['default'], exists('package.json', cb));
    });

    it('should run the `default` task with .generate', function(cb) {
      app.use(generator);
      app.generate('default', exists('package.json', cb));
    });
  });

  describe('files', function() {
    beforeEach(function() {
      app.cwd = actual();
    });

    it('should run the `gitignore` task', function(cb) {
      app.register('project', generator);
      app.generate('project:gitignore', exists('.gitignore', cb));
    });

    it('should generate a LICENSE file', function(cb) {
      app.register('project', generator);
      app.generate('project:mit', exists('LICENSE', cb));
    });

    it('should generate an index.js file', function(cb) {
      app.register('project', generator);
      app.generate('project:index', exists('index.js', cb));
    });

    it('should generate a .eslintrc.json file', function(cb) {
      app.register('project', generator);
      app.generate('project:eslintrc', exists('.eslintrc.json', cb));
    });

    it('should generate a README.md file', function(cb) {
      app.register('project', generator);
      app.generate('project:readme', exists('README.md', cb));
    });

    it('should generate a package.json file', function(cb) {
      app.register('project', generator);
      app.generate('project:package', exists('package.json', cb));
    });

    it('should generate a .gitignore file', function(cb) {
      app.register('project', generator);
      app.generate('project:gitignore', exists('.gitignore', cb));
    });

    it('should generate a .gitattributes file', function(cb) {
      app.register('project', generator);
      app.generate('project:gitattributes', exists('.gitattributes', cb));
    });

    it('should generate a .editorconfig file', function(cb) {
      app.register('project', generator);
      app.generate('project:editorconfig', exists('.editorconfig', cb));
    });

    it('should generate dotfiles', function(cb) {
      app.register('project', generator);
      app.generate('project:dotfiles', exists('.editorconfig', cb));
    });
  });

  describe('generator (CLI)', function() {
    it('should run the default task using the `generate-project` name', function(cb) {
      if (isTravis) return this.skip();
      app.generate('generate-project', exists('package.json', cb));
    });

    it('should run the default task using the `project` generator alias', function(cb) {
      if (isTravis) return this.skip();
      app.generate('project', exists('package.json', cb));
    });
  });

  describe('generator (API)', function() {
    it('should run the default task on the generator', function(cb) {
      app.register('project', generator);
      app.generate('project', exists('package.json', cb));
    });

    it('should run the `package` task', function(cb) {
      app.register('project', generator);
      app.generate('project:package', exists('package.json', cb));
    });

    it('should run the `default` task when defined explicitly', function(cb) {
      app.register('project', generator);
      app.generate('project:default', exists('package.json', cb));
    });
  });

  describe('project:minimal', function() {
    it('should run the minimal task on the generator', function(cb) {
      app.register('project', generator);
      app.generate('project:minimal', exists('package.json', cb));
    });

    it('should run the `min` alias task', function(cb) {
      app.register('project', generator);
      app.generate('project:min', exists('package.json', cb));
    });
  });

  describe('project:gulp', function() {
    it('should run the gulp task on the generator', function(cb) {
      app.register('project', generator);
      app.generate('project:gulp', exists('gulpfile.js', cb));
    });
  });

  describe('sub-generator', function() {
    it('should work as a sub-generator', function(cb) {
      app.register('foo', function(foo) {
        foo.register('project', generator);
      });
      app.generate('foo.project', exists('package.json', cb));
    });

    it('should run the `default` task by default', function(cb) {
      app.register('foo', function(foo) {
        foo.register('project', generator);
      });
      app.generate('foo.project', exists('package.json', cb));
    });

    it('should run the `project:default` task when defined explicitly', function(cb) {
      app.register('foo', function(foo) {
        foo.register('project', generator);
      });
      app.generate('foo.project:default', exists('package.json', cb));
    });

    it('should run the `project:package` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('project', generator);
      });
      app.generate('foo.project:package', exists('package.json', cb));
    });

    it('should work with nested sub-generators', function(cb) {
      app
        .register('foo', generator)
        .register('bar', generator)
        .register('baz', generator);
      app.generate('foo.bar.baz', exists('package.json', cb));
    });
  });
});
