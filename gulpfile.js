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
  replace = require('gulp-replace'),
  del = require('del'),
  header = require('gulp-header'),
  fs = require('fs'),
  config, getVersion, updateVersion;

config = {
  fileName: 'seed',
  path: {
    source: 'source/',
    build: 'build/',
    dist: 'dist/'
  },
};

updateVersion = function ( pkg ) {
  var v = pkg.version.split('.');

  // increase minor version
  v[2] = parseInt(v[2]) + 1;  
  pkg.version = v.join('.');

  // write down the new version into package.json file.
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

  // return new package 
  return pkg; 
};

getVersion = function () {
  var
  date  = new Date(),
  day   = date.getDate(),
  month = date.getMonth() + 1,
  year  = date.getFullYear(),
  hour  = date.getHours(),
  minute = date.getMinutes();

  day = ('00' + day).substr(-2);
  month = ('00' + month).substr(-2);
  hour = ('00' + hour).substr(-2);
  minute = ('00' + minute).substr(-2);

  return '' + year + month + day + hour + minute;
};

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
    .pipe(replace(/\{\%version\%\}/g, getVersion()))
    .pipe(gulp.dest(config.path.build));
});

gulp.task('build:javascript', function () {
  return gulp
    .src(config.path.source + 'js/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(config.path.build + 'assets/js'));
});

gulp.task('watch', function (cb) {

  runSequence(
    'clean',
    ['build:style', 'build:sass', 'build:jade', 'build:javascript'],
    'build:images',
    cb
  );

  sync.init({
    open: false,
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch(config.path.source + 'sass/sample.scss', ['build:style']);
  gulp.watch(config.path.source + 'sass/**/*.scss', ['build:sass']);
  gulp.watch(config.path.source + 'jade/**/*.jade', ['build:jade']);
  gulp.watch(config.path.source + 'js/**/*.js', ['build:javascript']);
  gulp.watch(config.path.source + 'images/**/*', ['build:images']);

  gulp.watch(config.path.build + 'assets/images/**/*' ).on('change', sync.reload);
  gulp.watch(config.path.build + '**/*.html' ).on('change', sync.reload);

});

gulp.task('dist:run', ['build:sass', 'build:jade'], function () {

  // get package json 
  var pkg = require('./package.json');

  // get latest minor version 
  pkg = updateVersion(pkg);

  // preparing the file header 
  var comment = '/** \n '
    + '* <%= pkg.name %> \n '
    + '* <%= pkg.description %> \n '
    + '* @author <%= pkg.author %> \n '
    + '* @copyright 2015-2016, <%= pkg.author %> \n '
    + '* @license <%= pkg.license %> \n '
    + '* @version <%= pkg.version %> \n '
    + '*/ \n\n ';

  return gulp
    .src(config.path.build + '**/*')
    .pipe(gulpif(/\.js$/, uglify()))
    .pipe(gulpif(/\.css$/, minify()))
    .pipe(gulpif(/\.(js|css)$/, header(comment, {pkg: pkg})))
    .pipe(gulp.dest(config.path.dist));
});

gulp.task('dist', function (cb) {

  runSequence(
    'clean',
    'dist:run',
    cb
  );

  return true;
});

gulp.task('default', ['watch']);
