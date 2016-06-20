'use strict';

var path = require('path');
var src = path.resolve.bind(path, __dirname, 'templates');
var isValid = require('is-valid-app');
var scaffold = require('base-scaffold');

module.exports = function(app, base) {
  var dest = app.options.dest || app.cwd;
  var task = createTask(app, dest);

  /**
   * Plugins
   */

  app.use(scaffold());
  app.use(require('generate-editorconfig'));
  app.use(require('generate-eslint'));
  app.use(require('generate-git'));
  app.use(require('generate-license'));
  app.use(require('generate-package'));
  app.use(require('generate-travis'));

  /**
   * Tasks
   */

  task('project', 'index.js');
  task('gp', 'gulp-plugin.js', 'index.js');
  task('bp', 'base-plugin.js', 'index.js');
  task('gen', 'generator/*.js');

  app.task('files', [
    'package',
    'license',
    'travis',
    'eslint',
    'eslintignore',
    'editorconfig',
    'git(i|a)*'
  ]);

  app.task('default', ['project']);
};

function createTask(app, dest) {
  return function(name, pattern, basename) {
    app.engine('*', require('engine-base'));
    app.task(name, ['files'], function(cb) {
      return app.src(src(pattern))
        .pipe(app.renderFile('*'))
        .pipe(app.conflicts(dest))
        .pipe(app.dest(function(file) {
          if (basename) file.basename = basename;
          return dest;
        }))
    });
  };
}
