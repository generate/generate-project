'use strict';

var path = require('path');
var tree = require('base-fs-tree');
var isValid = require('is-valid-app');
var src = path.resolve.bind(path, __dirname, 'templates');

module.exports = function(app, base) {
  if (!isValid(app, 'generate-project')) return;

  /**
   * Plugins
   */

  app.use(tree({name: 'generate-project'}));
  app.use(require('generate-defaults'));
  app.use(require('generate-install'));

  /**
   * Micro-generator plugins
   */

  app.use(require('generate-package'));
  app.use(require('generate-editorconfig'));
  app.use(require('generate-eslint'));
  app.use(require('generate-gitattributes'));
  app.use(require('generate-gitignore'));
  app.use(require('generate-license'));
  app.use(require('generate-readme'));
  app.use(require('generate-travis'));

  /**
   * Generates files from all registered micro-generators (runs each generator's `default`
   * task).
   *
   * ```sh
   * $ gen files
   * ```
   * @name files
   * @api public
   */

  app.task('files', [
    'package',
    'readme',
    'mit',
    'editorconfig',
    'eslintrc',
    'gitattributes',
    'gitignore',
    'travis'
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

  app.task('project', ['files', 'index']);

  /**
   * Scaffold out basic project for a [gulp][] plugin.
   *
   * ```sh
   * $ gen project:gulp
   * ```
   * @name gulp
   * @api public
   */

  app.task('gulp', ['gf', 'gp', 'files']);
  task(app, 'gf', 'gulp/gulpfile.js');
  task(app, 'gp', 'gulp/plugin.js');

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
  app.task('minimal', ['package', 'readme', 'mit', 'gitignore', 'gitattributes']);

  /**
   * Scaffold out a basic [generate][] generator project.
   *
   * ```sh
   * $ gen project:generator
   * # also aliased as
   * $ gen project:gen
   * ```
   * @name generator
   * @api public
   */

  app.task('gen', ['generator']);
  task(app, 'generator', 'generator/*.js', ['files']);

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
}

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern, dependencies) {
  app.task(name, dependencies || [], function(cb) {
    return app.src(pattern, {cwd: src()})
      .pipe(app.renderFile('*'))
      .pipe(app.conflicts(app.cwd))
      .pipe(app.dest(app.cwd));
  });
}
