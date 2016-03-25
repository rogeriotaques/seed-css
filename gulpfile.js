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
  fileName: 'seed',
  path: {
    source: 'source/',
    build: 'build/',
    dist: 'dist/'
  },
}

gulp.task('build:sass', function () {
  return gulp
    .src(config.path.source + 'sass/main.scss')
    .pipe(sass())
    .pipe(beautify({indent: '  ', autosemicolon: true}))
    .pipe(concat(config.fileName + '.css'))
    .pipe(gulp.dest(config.path.build + 'assets/css'))
    .pipe(sync.stream());
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

  gulp.watch(config.path.source + 'sass/**/*.scss', ['build:sass']);
  gulp.watch(config.path.source + 'jade/**/*.jade', ['build:jade']);
  gulp.watch(config.path.build + '**/*.html' ).on('change', sync.reload);

});

gulp.task('build', ['build:sass', 'build:jade'], function () {
  return gulp
    .src(config.path.build + '**/*')
    .pipe(gulpif(/\.css$/, minify()))
    .pipe(gulp.dest(config.path.dist));
});

gulp.task('default', ['watch']);
