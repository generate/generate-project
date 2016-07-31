'use strict';

var path = require('path');
var util = require('util');
var tree = require('base-fs-tree');
var isValid = require('is-valid-app');

module.exports = function(app) {
  if (!isValid(app, 'generate-project')) return;
  var trees = {};

  /**
   * Plugins
   */

  app.use(tree({name: 'generate-project'}));
  app.use(require('generate-defaults'));
  app.use(require('generate-install'));

  /**
   * Micro-generator plugins
   */

  app.use(require('generate-contributing'));
  app.use(require('generate-editorconfig'));
  app.use(require('generate-eslint'));
  app.use(require('generate-gitattributes'));
  app.use(require('generate-gitignore'));
  app.use(require('generate-license'));
  app.use(require('generate-package'));
  app.use(require('generate-readme'));
  app.use(require('generate-travis'));

  /**
   * Generates the [necessary files](#default-1) for a basic node.js project.
   *
   * ```sh
   * $ gen project
   * ```
   * @name default
   * @api public
   */

  task(app, 'default', null, ['project']);

  /**
   * Runs the `default` task on all registered micro-generators.
   *
   * ```sh
   * $ gen project:files
   * ```
   * @name files
   * @api public
   */

  task(app, 'files', null, ['dotfiles', 'rootfiles']);

  /**
   * Generate a basic `index.js` file. This task is used for composition with other tasks.
   *
   * ```sh
   * $ gen project:index
   * ```
   * @name index
   * @api public
   */

  task(app, 'index', 'index.js');

  /**
   * Generate the dotfiles from registered micro-generators .
   *
   * ```sh
   * $ gen project:dotfiles
   * ```
   * @name dotfiles
   * @api public
   */

  task(app, 'dotfiles', null, [
    'editorconfig',
    'eslintrc',
    'gitattributes',
    'gitignore',
    'travis'
  ]);

  /**
   * Generate the main project files from registered micro-generators: `contributing.md`,
   * `LICENSE`, 'package.json' and `README.md`.
   *
   * ```sh
   * $ gen project:rootfiles
   * ```
   * @name rootfiles
   * @api public
   */

  task(app, 'rootfiles', null, [
    'contributing',
    'mit',
    'package',
    'readme'
  ]);

  /**
   * Scaffold out a basic node.js project. This task is run by the [default task](#project).
   * Also, this task is aliased as `project:project` to simplify using this generator as a
   * plugin in other generators.
   *
   * ```sh
   * $ gen project
   * # or
   * $ gen project:project
   * ```
   * @name project
   * @api public
   */

  task(app, 'project', null, ['dotfiles', 'index', 'rootfiles']);

  /**
   * Scaffold out basic project for a [gulp][] plugin.
   *
   * ```sh
   * $ gen project:gulp
   * ```
   * @name gulp
   * @api public
   */

  task(app, 'gulp', null, ['dotfiles', 'gulp-plugin', 'gulp-file', 'rootfiles']);
  task(app, 'gulp-file', 'gulp/gulpfile.js');
  task(app, 'gulp-plugin', 'gulp/plugin.js');

  /**
   * Scaffold out a project for a [base][] plugin.
   *
   * ```sh
   * $ gen project:base
   * ```
   * @name base
   * @api public
   */

  task(app, 'base', null, ['dotfiles', 'base-index', 'rootfiles']);
  task(app, 'base-index', 'base/plugin.js');

  /**
   * Scaffold out a minimal code project,
   *
   * ```sh
   * $ gen project:min
   * # or
   * $ gen project:minimal
   * ```
   * @name minimal
   * @api public
   */

  task(app, 'min', null, ['minimal']);
  task(app, 'minimal', null, ['gitignore', 'mit', 'package', 'readme']);

  /**
   * Scaffold out a basic [generate][] generator project.
   *
   * ```sh
   * $ gen project:generator
   * ```
   * @name generator
   * @api public
   */

  task(app, 'gen', null, ['generator']);
  task(app, 'generator', null, ['dotfiles', 'generator-files', 'rootfiles']);
  task(app, 'generator-files', 'generator/*.js');

  /**
   * Scaffold out a basic template helper project.
   *
   * ```sh
   * $ gen project:helper
   * ```
   * @name helper
   * @api public
   */

  task(app, 'helper', 'helper/*.js', ['files']);

  /**
   * Generate project trees
   */

  app.task('trees', function(cb) {
    app.enable('silent');
    app.build('tree-*', cb);
  });
}

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern, dependencies) {
  // add a `tree-*` task for all matching tasks (need a better way of doing this)
  if (!/-/.test(name) && !/^(gen|min)$/.test(name)) {
    app.task(`tree-${name}`, [name], createTree(app));
  }

  app.task(name, dependencies || [], function(cb) {
    if (!pattern) return cb();
    return file(app, pattern);
  });
}

function file(app, pattern) {
  var src = app.options.srcBase || path.join(__dirname, 'templates');
  return app.src(pattern, {cwd: src})
    .pipe(app.renderFile('*')).on('error', console.log)
    .pipe(app.conflicts(app.cwd))
    .pipe(app.dest(app.cwd));
}

function createTree(app) {
  return function(cb) {
    var dest = app.options.trees || path.join(app.cwd, 'trees');
    var name = this.name.replace(/^tree-/, '');
    app.createTrees({name: name, dest: dest});
    app.log.time('creating tree for', app.log.green(name));
    cb();
  }
}
