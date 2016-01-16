var gulp = require('gulp');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var webserver = require('gulp-webserver');

gulp.task('scripts', function() {
    gulp.src(['./src/app.js', './src/**/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify('scripts move was successful'));
});

gulp.task('move', function() {
    gulp.src(['./src/index.html'])
        .pipe(gulp.dest('./dist'));

    gulp.src(['!./src/index.html', './src/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist/templates'))
        .pipe(notify('html move was successful'));
});

gulp.task('fonts', function() {
    gulp.src(['./bower_components/bootstrap/fonts/**/*'])
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('vendor-scripts', function() {
    gulp.src([
            './bower_components/angular/angular.min.js',
            //'./bower_components/jquery/dist/jquery.min.js',
            //'./bower_components/bootstrap/dist/js/bootstrap.min.js',
            './bower_components/angular-ui-router/release/angular-ui-router.min.js',
            './bower_components/angular-resource/angular-resource.min.js',
            './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './bower_components/angular-locker/dist/angular-locker.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify('vendor scripts move was successful'));
});

gulp.task('vendor-style', function() {
    gulp.src(['./bower_components/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify('vendor styles move was successfull'));
});

gulp.task('serve', function() {
    gulp.src('./dist')
        .pipe(webserver({
            port: 8080,
            livereload: true
        }))
        .pipe(notify('Webserver running'));
});

gulp.task('watch', ['serve'], function() {
    gulp.start(['vendor-scripts', 'vendor-style', 'scripts', 'move', 'fonts']);
    gulp.watch(['./src/**/*.js'], ['scripts']);
    gulp.watch(['./src/**/*.html'], ['move']);
});