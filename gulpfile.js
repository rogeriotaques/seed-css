var
  gulp = require('gulp'),
  runSequence = require('run-sequence'),
  sync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  beautify = require('gulp-cssbeautify'),
  minify = require('gulp-minify-css'),
  gulpif = require('gulp-if'),
  config;

config = {
  path: {
    source: 'source/',
    build: 'build/',
    dist: 'dist/'
  },
}

gulp.task('build:sass', function () {
  return gulp
    .src(config.path.source + 'sass/**/*.scss')
    .pipe(sass())
    .pipe(beautify({indent: '  ', autosemicolon: true}))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.path.build + 'assets/css'));
});

gulp.task('build:jade', function () {
  return gulp
    .src(config.path.source + 'jade/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(config.path.build));
});

gulp.task('watch', ['build:sass', 'build:jade'], function () {

  sync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp
    .watch(config.path.source + 'sass/**/*.scss', ['build:sass'])
    .on('change', function () { sync.reload(); });

  gulp
    .watch(config.path.source + 'jade/**/*.jade', ['build:jade'])
    .on('change', function () { sync.reload(); });

});

gulp.task('build', ['build:sass', 'build:jade'], function () {
  return gulp
    .src(config.path.build + '**/*')
    .pipe(gulpif(/\.css$/, minify()))
    .pipe(gulp.dest(config.path.dist));
});

gulp.task('default', ['watch']);
