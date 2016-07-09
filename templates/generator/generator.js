'use strict';

var path = require('path');
var isValid = require('is-valid-app');

module.exports = function(app) {
  // return if the generator is already registered
  if (!isValid(app, '<%= name %>')) return;

  /**
   * Generate a `index.js` file to the current working directory. Learn how to [customize
   * behavior(#customization) or override built-in templates.
   *
   * ```sh
   * $ gen <%= alias %>:<%= alias %>
   * ```
   * @name <%= alias %>:<%= alias %>
   * @api public
   */

  task(app, '<%= alias %>', 'index.js');

  /**
   * Alias for running the [<%= alias %>](#<%= alias %>) task with the following command:
   *
   * ```sh
   * $ gen <%= alias %>
   * ```
   * @name <%= alias %>
   * @api public
   */

  app.task('default', ['<%= alias %>']);
};

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern) {
  app.task(name, function() {
    return app.src(pattern, {cwd: __dirname})
      .pipe(app.renderFile('*'))
      .pipe(app.conflicts(app.cwd))
      .pipe(app.dest(app.cwd));
  });
}
