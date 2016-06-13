'use strict';

var path = require('path');
var isValid = require('is-valid-app');

module.exports = function(app, base) {
  if (!isValid(app, 'generate-project')) return;
  var src = path.resolve.bind(path, __dirname, 'templates');
  var dest = app.options.dest || app.cwd;

  app.use(require('generate-package'));
  app.use(require('generate-license'));
  app.use(require('generate-travis'));
  app.use(require('generate-eslint'));

  app.task('project', ['package', 'license', 'travis-yml', 'eslint'], function() {
    app.engine('*', require('engine-base'));
    return app.src(src('*.js'))
      .pipe(app.renderFile('*'))
      .pipe(app.conflicts(dest))
      .pipe(app.dest(dest))
  });

  app.task('default', ['project']);
};
