'use strict';

var path = require('path');
var isValid = require('is-valid-app');

module.exports = function(app) {
  if (!isValid(app, 'generate-project')) return;

  /**
   * Plugins
   */

  app.use(require('generate-defaults'));
  app.use(require('generate-install'));

  /**
   * Micro-generators (as plugins)
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
   * @name project
   * @api public
   */

  app.task('default', ['project']);
  app.task('project', ['is-empty', 'prompt', 'dotfiles', 'index', 'rootfiles']);

  /**
   * Prompts for commonly used data. This task isn't necessary needed, it's more of a convenience
   * for asking questions up front, instead of as files are generated. The actual messages for
   * questions can be found in the [common-questions][] library.
   *
   * ```sh
   * $ gen project:prompt
   * ```
   * @name project:prompt
   * @api public
   */

  app.task('prompt', function(cb) {
    if (app.options.prompt === false) return cb();
    app.question('homepage', 'Project homepage?');
    app.ask([
      'name',
      'description',
      'owner',
      'homepage',
      'author.name',
      'author.username',
      'author.url'
    ], cb);
  });

  /**
   * Verify that the current working directory is empty before generating any files.
   * This task is automatically run by the `default` task, but you'll need to call it
   * directly with any other task.
   *
   * ```sh
   * $ gen project:is-empty
   * ```
   * @name project:is-empty
   * @api public
   */

  app.task('is-empty', function(cb) {
    if (app.option('check-directory') === false) return cb();
    app.build('check-directory', cb);
  });

  /**
   * Runs the `default` task on all registered micro-generators. See the [generated files](#files-1).
   *
   * ```sh
   * $ gen project:files
   * ```
   * @name project:files
   * @api public
   */

  app.task('files', ['dotfiles', 'rootfiles']);

  /**
   * Generate a basic `index.js` file. This task is used for composition with other tasks.
   *
   * ```sh
   * $ gen project:index
   * ```
   * @name project:index
   * @api public
   */

  task(app, 'index', 'index.js');

  /**
   * Generate the dotfiles from registered micro-generators. See the [generated files](#dotfiles-1).
   *
   * ```sh
   * $ gen project:dotfiles
   * ```
   * @name project:dotfiles
   * @api public
   */

  app.task('dotfiles', [
    'editorconfig',
    'eslintrc',
    'gitattributes',
    'gitignore-minimal',
    'travis'
  ]);

  /**
   * Generate the main project files from registered micro-generators. See
   * the [generated files](#rootfiles-1).
   *
   * ```sh
   * $ gen project:rootfiles
   * ```
   * @name project:rootfiles
   * @api public
   */

  app.task('rootfiles', [
    'contributing',
    'license-mit',
    'package',
    'readme'
  ]);

  /**
   * Scaffold out basic project for a [gulp][] plugin. See the [generated files](#gulp-1).
   *
   * ```sh
   * $ gen project:gulp
   * ```
   * @name project:gulp
   * @api public
   */

  app.task('gulp', ['prompt', 'dotfiles', 'gulp-plugin', 'gulp-file', 'rootfiles']);
  task(app, 'gulp-file', 'gulp/gulpfile.js');
  task(app, 'gulp-plugin', 'gulp/plugin.js');

  /**
   * Scaffold out a project for a [base][] plugin. See the [generated files](#base-1).
   *
   * ```sh
   * $ gen project:base
   * ```
   * @name project:base
   * @api public
   */

  app.task('base', ['prompt', 'dotfiles', 'base-index', 'rootfiles']);
  task(app, 'base-index', 'base/plugin.js');

  /**
   * Scaffold out a minimal code project. See the [generated files](#minimal-1).
   *
   * ```sh
   * $ gen project:min
   * # or
   * $ gen project:minimal
   * ```
   * @name project:minimal
   * @api public
   */

  app.task('min', ['minimal']);
  app.task('minimal', ['prompt', 'gitignore-node', 'license-mit', 'package', 'readme']);

  /**
   * Scaffold out a basic [generate][] generator project.
   *
   * ```sh
   * $ gen project:generator
   * ```
   * @name project:generator
   * @api public
   */

  app.task('gen', ['generator']);
  app.task('generator', ['prompt', 'dotfiles', 'generator-files', 'rootfiles']);
  task(app, 'generator-files', 'generator/*.js');

  /**
   * Scaffold out a basic template helper project.
   *
   * ```sh
   * $ gen project:helper
   * ```
   * @name project:helper
   * @api public
   */

  task(app, 'helper', 'helper/*.js', ['files']);

  /**
   * Scaffold out an [assemble][] middleware project.
   *
   * ```sh
   * $ gen project:middleware
   * ```
   * @name project:middleware
   * @api public
   */

  task(app, 'middleware-index', 'middleware/index.js');
  app.task('middleware', ['prompt', 'dotfiles', 'middleware-index', 'rootfiles']);
};

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern, dependencies) {
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
