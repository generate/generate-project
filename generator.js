'use strict';

var path = require('path');
var util = require('util');
var clone = require('clone-deep');
var tree = require('base-fs-tree');
var isValid = require('is-valid-app');
var compare = require('./compare');

module.exports = function(app) {
  if (!isValid(app, 'generate-project')) return;
  var trees = {};

  /**
   * Plugins
   */

  app.use(tree({name: 'generate-project', write: false}));
  app.option('treename', function(file) {
    file.stem = file.stem.replace(/generate-project-/, '');
  });

  app.preWrite(/./, function(file, next) {
    if (app.options.tree && !/tree/.test(file.path)) {
      file.contents = null;
    }
    next();
  });

  // app.on('tree', function(namespace, name, prop, tree) {
  //   if (prop === 'dest') {
  //     trees[name] = clone(Object.keys(tree[namespace][prop].cwd));
  //   }
  // });

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
   * Generates files from all registered micro-generators (runs each generator's `default`
   * task).
   *
   * ```sh
   * $ gen project:files
   * ```
   * @name files
   * @api public
   */

  app.task('files', ['dotfiles', 'rootfiles']);

  /**
   * Generate the dotfiles from registered micro-generators .
   *
   * ```sh
   * $ gen project:dotfiles
   * ```
   * @name dotfiles
   * @api public
   */

  app.task('dotfiles', [
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

  app.task('rootfiles', [
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
   * # also aliased as
   * $ gen project:project
   * ```
   * @name project
   * @api public
   */

  app.task('project', ['dotfiles', 'index', 'rootfiles']);

  /**
   * Scaffold out basic project for a [gulp][] plugin.
   *
   * ```sh
   * $ gen project:gulp
   * ```
   * @name gulp
   * @api public
   */

  app.task('gulp', ['dotfiles', 'gp', 'gf', 'rootfiles']);
  task(app, 'gf', 'gulp/gulpfile.js');
  task(app, 'gp', 'gulp/plugin.js');

  /**
   * Scaffold out a [base][] plugin project.
   *
   * ```sh
   * $ gen project:base
   * ```
   * @name base
   * @api public
   */

  app.task('base', ['dotfiles', 'base-index', 'rootfiles']);
  task(app, 'base-index', 'base/plugin.js');

  /**
   * Scaffold out a minimal code project,
   *
   * ```sh
   * $ gen project:min
   * # also aliased as
   * $ gen project:minimal
   * ```
   * @name minimal
   * @api public
   */

  app.task('min', ['minimal']);
  app.task('minimal', ['gitignore', 'mit', 'package', 'readme']);

  /**
   * Scaffold out a basic [generate][] generator project.
   *
   * ```sh
   * $ gen project:generator
   * ```
   * @name generator
   * @api public
   */

  app.task('gen', ['generator']);
  app.task('generator', ['dotfiles', 'generator-files', 'rootfiles']);
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
   * Generate an `index.js` file. This task is used for composition with other tasks.
   *
   * ```sh
   * $ gen project:index
   * ```
   * @name index
   * @api public
   */

  task(app, 'index', 'index.js');

  /**
   * Generate a basic node.js project, then prompt to install dependencies
   * after files are written to the file system.
   *
   * ```sh
   * $ gen project
   * ```
   * @name default
   * @api public
   */

  app.task('default', ['project']);

  /**
   * Generate project trees
   */

  app.task('tree-default', ['default'], createTree(app));
  app.task('tree-dotfiles', ['dotfiles'], createTree(app));
  app.task('tree-generator', ['generator'], createTree(app));
  app.task('tree-gulp', ['gulp'], createTree(app));
  app.task('tree-min', ['min'], createTree(app));
  app.task('tree-minimal', ['minimal'], createTree(app));
  app.task('tree-project', ['project'], createTree(app));
  app.task('tree-rootfiles', ['rootfiles'], createTree(app));
  app.task('trees', ['tree-*', 'compare-trees']);
  app.task('compare-trees', function(cb) {
    compare(app.trees.views);
    // console.log();
    cb();
  });
}

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern, dependencies) {
  app.task(name, dependencies || [], function(cb) {
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
    cb();
  }
}
