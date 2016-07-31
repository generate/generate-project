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

var cwd = path.resolve.bind(path, process.cwd());
var actual = path.resolve.bind(path, __dirname, 'actual');

function exists(name, cb) {
  return function(err) {
    if (err) return cb(err);
    var filepath = actual(name);
    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      assert(stat);
      cb();
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
    del([cwd('test/trees'), actual()], cb);
  });

  // after(function(cb) {
  //   del(actual(), cb);
  // });

  beforeEach(function() {
    app = generate({silent: true});

    app.cwd = actual();
    app.option('dest', actual());
    app.option('trees', cwd('test/trees'));
    app.option('overwrite', function(file) {
      return /actual/.test(file.path);
    });

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

    it.only('should generate dotfiles', function(cb) {
      app.register('project', generator);
      app.generate('project:dotfiles', exists('.editorconfig', cb));
    });
  });

  describe('trees', function() {
    beforeEach(function() {
      app.cwd = actual();
    });

    it('should generate trees for all of the tasks', function(cb) {
      app.enable('overwrite');
      app.register('project', generator);
      app.generate('project:trees', cb);
    });

    it('should generate a tree for the default task', function(cb) {
      app.register('project', generator);
      app.generate('project:tree-default', exists('../trees/default-dest.txt', cb));
    });

    it('should generate a tree for the dotfiles task', function(cb) {
      app.register('project', generator);
      app.generate('project:tree-dotfiles', exists('../trees/dotfiles-dest.txt', cb));
    });

    it('should generate a tree for the generator task', function(cb) {
      app.register('project', generator);
      app.generate('project:tree-generator', exists('../trees/generator-dest.txt', cb));
    });

    it('should generate a tree for the gulp task', function(cb) {
      app.register('project', generator);
      app.generate('project:tree-gulp', exists('../trees/gulp-dest.txt', cb));
    });

    it('should generate a tree for the minimal task', function(cb) {
      app.register('project', generator);
      app.generate('project:tree-minimal', exists('../trees/minimal-dest.txt', cb));
    });

    it('should generate a tree for the min task alias', function(cb) {
      app.register('project', generator);
      app.generate('project:tree-min', exists('../trees/min-dest.txt', cb));
    });

    it('should generate a tree for the project task', function(cb) {
      app.register('project', generator);
      app.generate('project:tree-project', exists('../trees/project-dest.txt', cb));
    });

    it('should generate a tree for the rootfiles task', function(cb) {
      app.register('project', generator);
      app.generate('project:tree-rootfiles', exists('../trees/rootfiles-dest.txt', cb));
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
