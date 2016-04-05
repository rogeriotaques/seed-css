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
  del = require('del'),
  config;

config = {
  fileName: 'seed',
  path: {
    source: 'source/',
    build: 'build/',
    dist: 'dist/'
  },
}

gulp.task('clean', function () {
  return del([config.path.build, config.path.dist]);
});

gulp.task('build:images', function () {
  return gulp
    .src(config.path.source + 'images/**/*')
    .pipe(gulp.dest(config.path.build + 'assets/images'))
    .pipe(sync.stream());
});

gulp.task('build:style', function () {
  return gulp
    .src(config.path.source + 'sass/sample.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(beautify({indent: '  ', autosemicolon: true}))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(config.path.build + 'assets/css'))
    .pipe(sync.stream());
});

gulp.task('build:sass', function () {
  return gulp
    .src([
      config.path.source + 'sass/normalize.scss',
      config.path.source + 'sass/main.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(beautify({indent: '  ', autosemicolon: true}))
    .pipe(concat(config.fileName + '.css'))
    .pipe(gulp.dest(config.path.build + 'assets/css'))
    .pipe(sync.stream());
});

gulp.task('build:jade', function () {
  return gulp
    .src(config.path.source + 'jade/**/*.jade')
    .pipe(jade({pretty: true}).on('error', function (err) {
      console.log(err);
      this.emit('end');
    }))
    .pipe(gulp.dest(config.path.build));
});

gulp.task('watch', function (cb) {

  runSequence(
    'clean',
    ['build:style', 'build:sass', 'build:jade'],
    'build:images',
    cb
  );

  sync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch(config.path.source + 'sass/sample.scss', ['build:style']);
  gulp.watch(config.path.source + 'sass/**/*.scss', ['build:sass']);
  gulp.watch(config.path.source + 'jade/**/*.jade', ['build:jade']);
  gulp.watch(config.path.source + 'images/**/*', ['build:images']);

  gulp.watch(config.path.build + 'assets/images/**/*' ).on('change', sync.reload);
  gulp.watch(config.path.build + '**/*.html' ).on('change', sync.reload);

});

gulp.task('dist', ['build:sass', 'build:jade'], function () {
  return gulp
    .src(config.path.build + '**/*')
    .pipe(gulpif(/\.css$/, minify()))
    .pipe(gulp.dest(config.path.dist));
});

gulp.task('default', ['watch']);
