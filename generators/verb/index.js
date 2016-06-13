'use strict';

module.exports = function(app, base, env) {
  app.register('aaa', require('./generators/aaa'));
  app.register('bbb', require('./generators/bbb'));
  app.register('ccc', require('./generators/ccc'));

  app.task('default', function(cb) {
    console.log('verb > default');
    cb();
  });

  app.task('foo', function(cb) {
    console.log('verb > foo');
    cb();
  });

  app.task('fff', function(cb) {
    console.log('verb > fff');
    cb();
  });
};
