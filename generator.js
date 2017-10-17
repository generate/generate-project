'use strict';

var path = require('path');
var isValid = require('is-valid-app');
var Prompt = require('prompt-checkbox');
var Store = require('data-store');

module.exports = function generator(app) {
  if (!isValid(app, 'generate-project')) return;
  var store = new Store('generate-user-config');
  app.data(store.data);

  /**
   * Listen for errors
   */

  app.on('error', console.error);

  /**
   * Plugins
   */

  app.use(require('generate-defaults'));
  app.use(require('generate-install'));

  /**
   * Micro-generators (as plugins)
   */

  app.register('contributing', require('generate-contributing'));
  app.register('editorconfig', require('generate-editorconfig'));
  app.register('eslint', require('generate-eslint'));
  app.register('github', require('generate-gh-repo'));
  app.register('git', require('generate-git'));
  app.register('gitattributes', require('generate-gitattributes'));
  app.register('gitignore', require('generate-gitignore'));
  app.register('license', require('generate-license'));
  app.register('package', require('generate-package'));
  app.register('readme', require('generate-readme'));
  app.register('travis', require('generate-travis'));

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
  app.task('project', ['is-empty', 'prompt', 'rootfiles', 'dotfiles', 'index']);

  /**
   * Select one or more sub-generators or tasks to run.
   *
   * ```sh
   * $ gen project:choose
   * ```
   * @name choose
   * @api public
   */

  app.task('choose', function(cb) {
    var prompt = new Prompt({
      message: 'Select the tasks or sub-generators to run:',
      choices: Object.keys(app.generators)
    });

    prompt.run()
      .then(function(answer) {
        app.generate(answer, cb);
      });
  });

  /**
   * Generate starter files for a project. Runs the `default` task
   * on all micro-generators registered on `generate-project`.
   * See the list of [generated files](#files-1).
   *
   * ```sh
   * $ gen project:files
   * ```
   * @name project:files
   * @api public
   */

  app.task('files', ['rootfiles', 'dotfiles']);

  /**
   * Generate a basic `index.js` file. This task is used for composition
   * with other tasks.
   *
   * ```sh
   * $ gen project:index
   * ```
   * @name project:index
   * @api public
   */

  task(app, 'index', 'index.js');

  /**
   * Generate the dotfiles from registered micro-generators. See
   * the [generated files](#dotfiles-1).
   *
   * ```sh
   * $ gen project:dotfiles
   * ```
   * @name project:dotfiles
   * @api public
   */

  app.task('dotfiles', function(cb) {
    app.generate([
      'gitattributes',
      'gitignore:minimal',
      'eslint:eslintrc',
      'editorconfig',
      'travis'
    ], cb);
  });

  /**
   * Generate the main project files from registered micro-generators.
   * See the [generated files](#rootfiles-1).
   *
   * ```sh
   * $ gen project:rootfiles
   * ```
   * @name project:rootfiles
   * @api public
   */

  app.task('rootfiles', function(cb) {
    app.generate([
      `license:${app.options.license || 'mit'}`,
      'contributing',
      'package',
      'readme'
    ], cb);
  });

  /**
   * Scaffold out basic project for a [gulp][] plugin. See
   * the [generated files](#gulp-1).
   *
   * ```sh
   * $ gen project:gulp
   * ```
   * @name project:gulp
   * @api public
   */

  app.task('gulp', ['prompt', 'rootfiles', 'dotfiles', 'gulp-plugin', 'gulp-file']);
  task(app, 'gulp-file', 'gulp/gulpfile.js');
  task(app, 'gulp-plugin', 'gulp/plugin.js');

  /**
   * Scaffold out a project for a [base][] plugin. See the
   * [generated files](#base-1).
   *
   * ```sh
   * $ gen project:base
   * ```
   * @name project:base
   * @api public
   */

  app.task('base', ['prompt', 'rootfiles', 'dotfiles', 'base-index']);
  task(app, 'base-index', 'base/plugin.js');

  /**
   * Scaffold out a minimal code project. See the [generated files](#minimal-1).
   *
   * ```sh
   * $ gen project:min
   * $ gen project:minimal
   * ```
   * @name project:minimal
   * @api public
   */

  app.task('min', ['minimal']);
  app.task('minimal', function(cb) {
    app.generate([
      'is-empty',
      'prompt',
      'gitignore:node',
      `license:${app.options.license || 'mit'}`,
      'package',
      'readme'
    ], cb);
  });

  /**
   * Scaffold out a basic code project. See the [generated files](#basic-1).
   *
   * ```sh
   * $ gen project:basic
   * ```
   * @name project:basic
   * @api public
   */

  app.task('basic', function(cb) {
    app.generate([
      'is-empty',
      'prompt',
      'gitignore:node',
      'license:choose',
      'package',
      'readme'
    ], cb);
  });

  /**
   * Scaffold out a basic code project. See the [generated files](#basic-1).
   *
   * ```sh
   * $ gen project:basic
   * ```
   * @name project:basic
   * @api public
   */

  task(app, 'update-configfile', 'update/_updaterc.json');
  app.task('update-rc', [
    'is-empty',
    'prompt',
    'rootfiles',
    'dotfiles',
    'update-configfile'
  ]);

  /**
   * Scaffold out a basic [generate][] generator project.
   *
   * ```sh
   * $ gen project:generator
   * ```
   * @name project:generator
   * @api public
   */

  task(app, 'generator-files', 'generator/*.js');
  app.task('gen', ['generator']);
  app.task('generator', [
    'is-empty',
    'prompt',
    'rootfiles',
    'dotfiles',
    'generator-files'
  ]);

  /**
   * Scaffold out a basic template helper project.
   *
   * ```sh
   * $ gen project:helper
   * ```
   * @name project:helper
   * @api public
   */

  task(app, 'helper', 'helper/*.js', ['is-empty', 'prompt', 'files']);

  /**
   * Scaffold out a basic JavaScript regex project.
   *
   * ```sh
   * $ gen project:regex
   * ```
   * @name project:regex
   * @api public
   */

  task(app, 'regex', 'regex/*.js', ['is-empty', 'prompt', 'files']);

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
  app.task('middleware', [
    'is-empty',
    'prompt',
    'rootfiles',
    'dotfiles',
    'middleware-index'
  ]);

  /**
   * Prompts for commonly used data. This task isn't necessary
   * needed, it's more of a convenience for asking questions up front,
   * instead of as files are generated. The actual messages for questions
   * can be found in the [common-questions][] library.
   *
   * ```sh
   * $ gen project:prompt
   * ```
   * @name project:prompt
   * @api public
   */

  app.task('prompt', function(cb) {
    if (app.options.prompt === false) return cb();
    app.base.data(app.cache.data);

    app.base.set('cache.prompted', true);
    app.question('homepage', 'Project homepage?');

    // common question names
    var keys = mapValues([
      'name',
      'description',
      'owner',
      'homepage',
      'license',
      'author.name',
      'author.username',
      'author.url'
    ], app);

    if (keys.skip.length) {
      app.log();
      app.log('', app.log.yellow(app.log.bold(app.log.underline('Heads up!'))));
      app.log();
      app.log(' The following data from user environment and/or package.json');
      app.log(' will be used to render templates (if applicable), and prompts');
      app.log(' for these values will be skipped:');
      app.log();
      app.log(formatFields(app, keys.skip));
      app.log(` Run with ${app.log.cyan('--noskip')} to disable this feature.`);
      app.log();
      app.log(' ---');
      app.log();
    }

    app.ask(keys.ask, cb);
  });

  /**
   * Verify that the current working directory is empty before generating any files.
   * This task is automatically run by the `default` task, but you'll need to call it
   * directly with any other task. This task is from [generate-defaults][].
   *
   * ```sh
   * $ gen project:is-empty
   * ```
   * @name project:is-empty
   * @api public
   */

  app.task('is-empty', function(cb) {
    if (app.option('check-directory') !== false) {
      app.build('check-directory', cb);
    } else {
      cb();
    }
  });

  return generator;
};

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern, dependencies) {
  app.task(name, dependencies || [], function(cb) {
    return pattern ? file(app, pattern) : cb();
  });
}

/**
 * Generate files that match the given `pattern`
 */

function file(app, pattern) {
  var src = app.options.srcBase || path.join(__dirname, 'templates');
  return app.src(pattern, {cwd: src})
    .pipe(app.renderFile('*')).on('error', console.log)
    .pipe(app.conflicts(app.cwd))
    .pipe(app.dest(app.cwd));
}

/**
 * Map values and filter out keys for data that has already been defined,
 * to avoid asking unnecessary questions. This can be overridden
 * with `--noskip`
 */

function mapValues(keys, app) {
  if (app.option('hints') === false || app.option('skip') === false) {
    return {ask: keys, skip: []};
  }

  var res = {ask: [], skip: []};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!app.has('cache.data', key)) {
      res.ask.push(key);
    } else {
      app.base.data(key, app.data(key));
      res.skip.push([key, app.data(key)]);
    }
  }
  return res;
}

/**
 * Format skipped fields
 */

function formatFields(app, keys) {
  var list = '';
  keys.forEach(function(key) {
    list += '  · ' + app.log.bold(key[0]);
    list += ': ' + app.log.green(key[1]) + '\n';
  });
  return list;
}
