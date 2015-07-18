var fs = require('fs');
var gulp = require('gulp');
var less = require('gulp-less');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var ftp = require('vinyl-ftp');
var deployGlobs = ['*', '!js/*.js', 'js/*.min.js*', '!./*.less', '!/node_modules/*', '!.ftppass'];
var authData = JSON.parse(fs.readFileSync('.ftppass', 'utf8'));

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
    console.log(authData);



});

gulp.task('less', function() {

    gulp.src('style.less')
        .pipe(less({
            plugins: [autoprefix, cleancss]
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('scripts', function() {
    return gulp.src(['js/*.js', '!js/*.min.js*'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('js'));

});

gulp.task('deploy', function() {
    var conn = ftp.create({
        host: 'thebettermentofseve.com',
        user: authData['keyMain']['user'],
        password: authData['keyMain']['pass'],
        parallel: 10,
        log: gutil.log
    });



    return gulp.src(deployGlobs, {
            base: '.',
            buffer: false
        })
        .pipe(conn.newer('/public_html/wp-content/themes/thenewbetterment')) // only upload newer files 
        .pipe(conn.dest('/public_html/wp-content/themes/thenewbetterment'));
});

gulp.task('watch', function() {
    gulp.watch('./*.less', ['less']);
    gulp.watch(['js/*.js', '!js/*.min.js*'], ['scripts']);
    gulp.watch(deployGlobs, ['deploy']);

});
