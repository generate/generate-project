'use strict';

var tree = require('base-fs-tree');
var del = require('delete');
var path = require('path');

module.exports = function(app) {
  app.use(require('verb-generate-readme'));
  app.register('project', require('./'));

  /**
   * Load `tree` partials
   */

  app.task('trees', function(cb) {
    var gen = app.generator('project')
      .option('layout', false)
      .option('dest', '.temp-trees')
      .preRender(/./, function(file, next) {
        file.content = '{}';
        next();
      });

    gen.build('trees', function(err) {
      if (err) return cb(err);
      app.include('trees', {content: gen.compareTrees()});
      app.option('dest', process.cwd()); //<= reset dest
      cb();
    });
  });

  app.task('delete', function(cb) {
    del('.temp-trees', cb);
  });

  app.task('default', ['trees', 'readme', 'delete']);
};
