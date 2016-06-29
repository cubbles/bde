"use strict";

const gulp = require('gulp')
const browserify = require('gulp-browserify')
const concat = require('gulp-concat')
const exec = require('child_process').exec
const minify = require('gulp-minify')

gulp.task('build-fa', function(cb) {
  exec('node ./scripts/build-font-awesome.js', function(err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
})

gulp.task('browserify', function() {
  return gulp.src('./index.js', { read: false })
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }))
    .pipe(concat('noflo.js'))
    .pipe(minify({
      ext: {
        src: '.js',
        min: '.min.js'
      }
    }))
    .pipe(gulp.dest('./build/'));
})

// Default task
gulp.task('default', ['build-fa', 'browserify'])