'use strict';

const minify = require('gulp-minify');
const gulp = require('gulp');

gulp.task('compress', function() {
  gulp.src(['./*.js', './*.mjs'])
    .pipe(minify())
    .pipe(gulp.dest('dist'))
});
