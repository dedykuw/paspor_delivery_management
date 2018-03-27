var gulp = require('gulp');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');


gulp.task('sass', function() {
    return gulp.src('public/scss/style.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('public/css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css'))
});

gulp.task('angular', function() {
  return gulp.src([
    'app/app.js',
    'app/controllers/*.js',
    'app/services/*.js',
    'app/directives/*.js'
  ])
    .pipe(concat('application.js'))
    .pipe(ngAnnotate())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js'));
});

gulp.task('confirm_angular', function() {
  return gulp.src([
    'confirm_app/app.js',
    'confirm_app/controllers/*.js',
    'confirm_app/services/*.js'
  ])
    .pipe(concat('confirm_app.js'))
    .pipe(ngAnnotate())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js/confirm'));
});

gulp.task('templates', function() {
  return gulp.src('app/partials/**/*.html')
    .pipe(templateCache({ root: 'partials', module: 'MyApp' }))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js'));
});

gulp.task('confirm_templates', function() {
  return gulp.src('confirm_app/partials/**/*.html')
    .pipe(templateCache({ root: 'partials', module: 'MyConfirmApp' }))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js/confirm'));
});

gulp.task('vendor', function() {
  return gulp.src('app/vendor/*.js')
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js/lib'));
});

gulp.task('watch', function() {
  gulp.watch('app/partials/**/*.html', ['templates']);
  gulp.watch('app/**/*.js', ['angular']);
  gulp.watch('confirm_app/partials/**/*.html', ['confirm_templates']);
  gulp.watch('confirm_app/**/*.js', ['confirm_angular']);
});

gulp.task('build', ['angular', 'vendor', 'templates', 'confirm_templates', 'confirm_angular','sass']);
gulp.task('default', ['build', 'watch']);


