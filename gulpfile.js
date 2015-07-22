(function () {
  'use strict';

  var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    exec = require('child_process').exec;

  gulp.task('watch-test', function () {
    gulp.watch('lib/*.js', ['test']);
  });

  gulp.task('watch-lint', function () {
    gulp.watch('lib/*.js', ['lint']);
  });

  gulp.task('lint', function () {
    gulp.src('lib/*.js')
      .pipe(jshint('.jshintrc', {fail: true}))
      .pipe(jshint.reporter()); // Console output
  });

  gulp.task('test', function (cb) {

    exec('NODE_ENV=test node ./node_modules/istanbul-harmony/lib/cli.js cover node_modules/mocha/bin/_mocha ' +
      '-x \'*spec.js\' --root lib/ --dir test/coverage  -- -R spec --recursive \'lib/*spec.js\'', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  });

})();
