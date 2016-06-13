'use strict';

module.exports = function(app, base, env) {
  app.task('default', function(cb) {
    console.log('node > default');
    cb();
  });

  app.task('foo', function(cb) {
    console.log('node > foo');
    cb();
  });
};
