'use strict';

var path = require('path');
var isValid = require('is-valid-app');
var src = path.resolve.bind(path, __dirname, 'templates');

module.exports = function(app) {
  // return if the generator is already registered
  if (!isValid(app, '<%= name %>')) return;

  /**
   * Generate a `<%= alias %>` file to the current working directory. You can override
   * the default template by adding a custom template at the following path:
   * `~/templates/<%= alias %>.md` (in user home).
   *
   * ```sh
   * $ gen <%= alias %>
   * ```
   * @name <%= alias %>
   * @api public
   */

  app.task('<%= alias %>', function(cb) {
    var dest = app.option('dest') || app.cwd;

    app.template(src('<%= alias %>'));
    return app.toStream('templates', pickFile(app))
      .pipe(app.renderFile('*'))
      .pipe(app.conflicts(dest))
      .pipe(app.dest(dest));
  });

  app.task('default', ['<%= alias %>']);
};

/**
 * Pick the file to render. If the user specifies a `--file`, use that,
 * otherwise use the default `$package.json` template
 */

function pickFile(app, fallback) {
  return function(key, file) {
    return file.stem === (app.option('file') || fallback || '<%= alias %>');
  };
}
