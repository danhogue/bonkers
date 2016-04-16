var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jsx = require('gulp-jsx');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var exec = require('child_process').exec;

gulp.task('clean', function () {
    return gulp.src([
        'application/css/compiled/*',
        'application/js/compiled/*',
        'build/*'
    ], {read: false})
        .pipe(clean());
});

gulp.task('scss', function() {
    return gulp.src(['application/css/*.scss',
        'application/css/components/*.scss',
        'application/css/pages/*.scss'
    ])
        .pipe(sass())
        .pipe(gulp.dest('application/css/compiled'))
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('build/css'))
});

gulp.task('scripts', function() {
    return gulp.src([
        'application/js/main.js',
        'application/js/components/*.js',
        'application/js/pages/*.js',
        'application/js/router.js'
    ])
        .pipe(jsx({factory: 'React.createElement'}))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('application/js/compiled'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('copy', function (cb) {
    gulp.src(['application/*.*'])
        .pipe(gulp.dest('build/'));
    gulp.src(['application/apps/**/*.*'])
        .pipe(gulp.dest('build/apps/'));
    gulp.src(['application/controllers/*'])
        .pipe(gulp.dest('build/controllers/'));
    gulp.src('application/views/*')
        .pipe(gulp.dest('build/views'));
    gulp.src('application/fonts/*')
        .pipe(gulp.dest('build/fonts/'));
    gulp.src('application/helpers/*')
        .pipe(gulp.dest('build/helpers/'));
    gulp.src('application/img/*')
        .pipe(gulp.dest('build/img/'));
    gulp.src('application/locales/*')
        .pipe(gulp.dest('build/locales/'));
    gulp.src('application/models/*')
        .pipe(gulp.dest('build/models/'));
    gulp.src('LICENSE.md')
        .pipe(gulp.dest('build/'));
});

gulp.task('lint', function() {
    return gulp.src('application/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('watch', function() {
    gulp.watch('application/**/*.*', ['build']);
});

gulp.task('build', ['scss', 'scripts', 'copy']);
