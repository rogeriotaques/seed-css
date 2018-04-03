var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  sync = require('browser-sync'),
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
  util = require('gulp-util'),
  fs = require('fs'),
  config,
  getBuildVersion,
  updatePackVersion;

// @use npm run dist -- --[major|minor]
var runFlag =
  util.env.major !== undefined
    ? 'major'
    : util.env.minor !== undefined ? 'minor' : 'patch';

config = {
  fileName: 'seed',
  path: {
    source: 'source/',
    build: 'build/',
    dist: 'dist/'
  }
};

updatePackVersion = function(pkg) {
  var v = pkg.version.split('.');

  switch (runFlag) {
    case 'major':
      // increase major version
      v[0] = parseInt(v[0]) + 1;
      v[1] = 0;
      v[2] = 0;
      pkg.version = v.join('.');
      break;

    case 'minor':
      // increase minor version
      v[1] = parseInt(v[1]) + 1;
      v[2] = 0;
      pkg.version = v.join('.');
      break;

    default:
      // patch
      // increase patch version
      v[2] = parseInt(v[2]) + 1;
      pkg.version = v.join('.');
      break;
  }

  // write down the new version into package.json file.
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

  // return new package
  return pkg;
};

getBuildVersion = function() {
  var date = new Date(),
    day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear(),
    hour = date.getHours(),
    minute = date.getMinutes();

  day = ('00' + day).substr(-2);
  month = ('00' + month).substr(-2);
  hour = ('00' + hour).substr(-2);
  minute = ('00' + minute).substr(-2);

  return '' + year + month + day + hour + minute;
};

gulp.task('clean', function() {
  return del([config.path.build]);
});

gulp.task('clean:dist', function() {
  return del([config.path.build, config.path.dist]);
});

gulp.task('build:images', function() {
  return gulp
    .src(config.path.source + 'images/**/*')
    .pipe(gulp.dest(config.path.build + 'assets/images'));
});

gulp.task('build:style', function() {
  return gulp
    .src(config.path.source + 'sass/sample.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(beautify({ indent: '  ', autosemicolon: true }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(config.path.build + 'assets/css'))
    .pipe(sync.reload({ stream: true }));
});

gulp.task('build:sass', function() {
  return gulp
    .src([
      config.path.source + 'sass/normalize.scss',
      config.path.source + 'sass/main.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(beautify({ indent: '  ', autosemicolon: true }))
    .pipe(concat(config.fileName + '.css'))
    .pipe(gulp.dest(config.path.build + 'assets/css'))
    .pipe(sync.reload({ stream: true }));
});

gulp.task('build:jade', function() {
  var pkg = require('./package.json');

  return gulp
    .src(config.path.source + 'jade/*.jade')
    .pipe(
      jade({ pretty: true }).on('error', function(err) {
        console.log(err);
        this.emit('end');
      })
    )
    .pipe(replace(/\{\%version\%\}/g, 'v' + pkg.version))
    .pipe(replace(/\{\%year\%\}/g, new Date().getFullYear()))
    .pipe(gulp.dest(config.path.build));
});

gulp.task('build:jade-watch', ['build:jade'], sync.reload);

gulp.task('build:javascript', function() {
  // website bundle
  gulp
    .src([
      config.path.source + 'js/components/*.js',
      config.path.source + 'js/*.js'
    ])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(config.path.build + 'assets/js'))
    .pipe(sync.reload({ stream: true }));

  // dist seed-css.js
  gulp
    .src([config.path.source + 'js/components/*.js'])
    .pipe(concat('seed-css.js'))
    .pipe(gulp.dest(config.path.build + 'assets/js'))
    .pipe(sync.reload({ stream: true }));

  return true;
});

gulp.task('watch', function(cb) {
  runSequence(
    'clean',
    ['build:style', 'build:sass', 'build:jade', 'build:javascript'],
    'build:images',
    cb
  );

  sync.init({
    open: false,
    notify: false,
    port: 9000,
    server: {
      baseDir: './build'
    }
  });

  gulp.watch(config.path.source + 'sass/sample.scss', ['build:style']);
  gulp.watch(config.path.source + 'sass/**/*.scss', ['build:sass']);
  gulp.watch(config.path.source + 'js/**/*.js', ['build:javascript']);
  gulp.watch(config.path.source + 'jade/**/*.jade', ['build:jade-watch']);
  gulp.watch(config.path.source + 'images/**/*', ['build:images']);

  gulp
    .watch(config.path.build + 'assets/images/**/*')
    .on('change', sync.reload);
});

gulp.task(
  'dist:run',
  ['build:sass', 'build:jade', 'build:javascript'],
  function() {
    // get package json
    var pkg = require('./package.json');

    // updates the version
    pkg = updatePackVersion(pkg);

    // prepare files header
    var comment =
      '/** \n ' +
      '* <%= pkg.name %> \n ' +
      '* <%= pkg.description %> \n ' +
      '* @author <%= pkg.author %> \n ' +
      '* @copyright 2015-' +
      new Date().getFullYear() +
      ', <%= pkg.author %> \n ' +
      '* @license <%= pkg.license %> \n ' +
      '* @version <%= pkg.version %> \n ' +
      '*/ \n\n ';

    return gulp
      .src([
        config.path.build + 'assets/css/seed.css',
        config.path.build + 'assets/js/seed-css.js'
      ])
      .pipe(
        gulpif(
          /\.js$/,
          uglify().on('error', function(o) {
            console.log(o);
          })
        )
      )
      .pipe(gulpif(/\.css$/, minify()))
      .pipe(gulpif(/\.(js|css)$/, header(comment, { pkg: pkg })))
      .pipe(gulp.dest(config.path.dist));
  }
);

gulp.task('dist', function(cb) {
  runSequence('clean:dist', 'dist:run', cb);
  return true;
});

gulp.task('default', ['watch']);
