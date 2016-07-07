'use strict';

var path = require('path');
var src = path.resolve.bind(path, __dirname, 'templates');
var isValid = require('is-valid-app');

module.exports = function(app, base) {
  if (!isValid(app, 'generate-project')) return;
  var task = createTask(app);

  /**
   * Register other "micro-generators" as plugins
   */

  app.use(require('generate-collections'));
  app.use(require('generate-defaults'));
  app.use(require('generate-editorconfig'));
  app.use(require('generate-eslint'));
  app.use(require('generate-git'));
  app.use(require('generate-license'));
  app.use(require('generate-package'));
  app.use(require('generate-travis'));
  app.use(require('generate-install'));

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
   * $ gen project:gulp-plugin
   * # also aliased as
   * $ gen project:gp
   * ```
   * @name gulp-plugin
   * @api public
   */

  app.task('gp', ['gulp-plugin']);
  task('gulp-plugin', ['files'], 'gulp-plugin.js');

  /**
   * Scaffold out a basic project for a [base][] plugin.
   *
   * ```sh
   * $ gen project:base-plugin
   * # also aliased as
   * $ gen project:bp
   * ```
   * @name base-plugin
   * @api public
   */

  app.task('bp', ['base-plugin']);
  task('base-plugin', ['files'], 'base-plugin.js');

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

  app.task('docs', ['minimal', 'editorconfig', 'verbmd']);

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

  task('gen', ['files'], 'generator/*.js');

  /**
   * Generate an `index.js` file. This task is used for composition with other tasks.
   *
   * ```sh
   * $ gen project:index
   * ```
   * @name index
   * @api public
   */

  task('index', [], 'index.js');

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

function createTask(app) {
  return function(name, dependencies, pattern) {
    var dest = app.options.dest || app.cwd;
    app.task(name, dependencies, function() {
      return app.src(src(pattern))
        .pipe(app.renderFile('*'))
        .pipe(app.conflicts(dest))
        .pipe(app.dest(dest))
        .on('end', function() {
          app.emit('taskEnd', name);
        });
    });
  };
}
