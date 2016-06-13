'use strict';

module.exports = function(app, base, env) {
  app.task('default', function(cb) {
    console.log('aaa > default');
    cb();
  });

  app.task('foo', function(cb) {
    console.log('aaa > foo');
    cb();
  });

  app.task('fff', function(cb) {
    console.log('aaa > fff');
    cb();
  });
};
