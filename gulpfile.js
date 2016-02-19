var path = require('path')
var gulp = require("gulp")
var karma = require('gulp-karma')
var mocha = require('gulp-mocha')
var eslint = require("gulp-eslint")

var srcPath = {
  watch: ['app/javascript/*.*']
}

gulp.task('default', function () {
  gulp.watch(srcPath.watch, ['lint'])
})

gulp.task('lint', function () {
  return gulp.src(srcPath.watch)
    .pipe(eslint())
    .pipe(eslint.format())
    //.pipe(eslint.failAfterError())
    .pipe(eslint.results(function (results) {
        console.log('Total Results: ' + results.length);
        console.log('Total Warnings: ' + results.warningCount);
        console.log('Total Errors: ' + results.errorCount);
    }))
})
