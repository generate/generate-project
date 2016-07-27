'use strict';

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

describe('generate-project', function() {
  this.slow(350);

  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('generate', cb);
    });
  }

  before(function(cb) {
    del(actual(), cb);
  });

  beforeEach(function(cb) {
    app = generate({silent: true});
    app.cwd = actual();
    app.option('dest', actual());

    // pre-populate template data to avoid prompts from `ask` helper
    app.option('askWhen', 'not-answered');
    app.data({
      author: {
        name: 'Jon Schlinkert',
        username: 'jonschlnkert',
        url: 'https://github.com/jonschlinkert'
      },
      basename: 'LICENSE',
      name: 'foo',
      description: 'bar',
      version: '0.1.0',
      project: {
        name: 'foo',
        description: 'bar',
        version: '0.1.0'
      }
    });
    del(actual('*'), cb);
  });

  afterEach(function(cb) {
    del(actual('*'), cb);
  });

  describe('tasks', function() {
    it('should extend tasks onto the instance', function() {
      app.use(generator);
      assert(app.tasks.hasOwnProperty('default'));
      assert(app.tasks.hasOwnProperty('package'));
    });

    it('should run the `default` task with .build', function(cb) {
      app.use(generator);
      app.build('default', exists('package.json', cb));
    });

    it('should run the `default` task with .generate', function(cb) {
      app.use(generator);
      app.generate('default', exists('package.json', cb));
    });
  });

  if (!process.env.CI && !process.env.TRAVIS) {
    describe('generator (CLI)', function() {
      it('should run the default task using the `generate-project` name', function(cb) {
        app.generate('generate-project', exists('package.json', cb));
      });

      it('should run the default task using the `project` generator alias', function(cb) {
        app.generate('project', exists('package.json', cb));
      });
    });
  }

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
