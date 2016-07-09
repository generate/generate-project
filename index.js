'use strict';

var path = require('path');
var src = path.resolve.bind(path, __dirname, 'templates');
var isValid = require('is-valid-app');

module.exports = function(app, base) {
  if (!isValid(app, 'generate-project')) return;

  /**
   * Register other "micro-generators" as plugins
   */

  app.use(require('generate-collections'));
  app.use(require('generate-defaults'));
  app.use(require('generate-editorconfig'));
  app.use(require('generate-eslint'));
  app.use(require('generate-git'));
  app.use(require('generate-install'));
  app.use(require('generate-license'));
  app.use(require('generate-package'));
  app.use(require('generate-travis'));

  /**
   * Sub-generators
   */

  app.register('mocha', function() {
    this.use(require('generate-mocha'));
  });

  /**
   * Task for generating files from registered micro-generators.
   */

  app.task('files', [
    'editorconfig',
    'eslint',
    'gitattributes',
    'gitignore',
    'travis',
    'package',
    'license'
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
   * Scaffold out a basic project for a [base][] plugin.
   *
   * ```sh
   * $ gen project:base
   * ```
   * @name base
   * @api public
   */

  task(app, 'base', 'base/*.js', ['files', 'base-tests']);
  app.task('base-tests', function(cb) {
    app.generate('mocha:base', cb);
  });

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
  app.task('minimal', ['package', 'license', 'gitignore', 'gitattributes']);

  /**
   * Scaffold out minimal code project, along with a [.verb.md](https://github.com/verbose/verb)
   * readme template.
   *
   * ```sh
   * $ gen project:docs
   * ```
   * @name docs
   * @api public
   */

  app.task('docs', ['minimal', 'editorconfig']);

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
  test(app, 'generator');

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

  app.task('default', ['project', 'install']);
};

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern, dependencies) {
  app.task(name, dependencies || [], function() {
    var dest = app.options.dest || app.cwd;
    return app.src(src(pattern))
      .pipe(app.renderFile('*'))
      .pipe(app.conflicts(dest))
      .pipe(app.dest(dest));
  });
}

function test(app, name) {
  app.task(`${name}-tests`, function(cb) {
    app.generate(`mocha:${name}`, cb);
  });
}
