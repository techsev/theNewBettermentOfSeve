var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var path = require('path');
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({
        advanced: true
    }),
    autoprefix = new LessPluginAutoPrefix({
        browsers: ["last 2 versions"]
    });
var jshint = require('gulp-jshint');

gulp.task('default', function() {


});

gulp.task('less', function() {

    gulp.src('style.less')
        .pipe(less({
            plugins: [autoprefix, cleancss]
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));

});
