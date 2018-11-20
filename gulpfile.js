const gulp = require('gulp');
const sync = require('browser-sync');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const beautify = require('gulp-cssbeautify');
const del = require('del');
const pug = require('gulp-pug');
const replace = require('gulp-replace');
const minify = require('gulp-clean-css');
const header = require('gulp-header');
const fs = require('fs');
const util = require('minimist')(process.argv);

// @use npm run dist -- --[major|minor]
let runFlag = 'patch';

if (util.major !== undefined) {
  runFlag = 'major';
} else if (util.minor !== undefined) {
  runFlag = 'minor';
}

const config = {
  fileName: 'seed',
  path: {
    source: 'source/',
    build: 'build/',
    dist: 'dist/'
  }
};

const updatePackVersion = (pkg) => {
  const v = pkg.version.split('.');

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

/**
 * Reset the build folder for development.
 */
gulp.task('clean', () => del([config.path.build]));

/**
 * Reset the distribution pack.
 */
gulp.task('clean:dist', () => del([config.path.build, config.path.dist]));

/**
 * Copies the images to the dist folder.
 */
gulp.task('build:images', () =>
  gulp
    .src(config.path.source + 'images/**/*')
    .pipe(gulp.dest(config.path.build + 'assets/images'))
);

/**
 * Builds the sample page styling
 */
gulp.task('build:style', () =>
  gulp
    .src(config.path.source + 'sass/sample.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(beautify({ indent: '  ', autosemicolon: true }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(config.path.build + 'assets/css'))
    .pipe(sync.reload({ stream: true }))
);

/**
 * Builds the product styling
 */
gulp.task('build:sass', () =>
  gulp
    .src([
      config.path.source + 'sass/normalize.scss',
      config.path.source + 'sass/main.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(beautify({ indent: '  ', autosemicolon: true }))
    .pipe(concat(config.fileName + '.css'))
    .pipe(gulp.dest(config.path.build + 'assets/css'))
    .pipe(sync.reload({ stream: true }))
);

/**
 * Builds the HTML pages
 */
gulp.task('build:pug', () => {
  const pkg = require('./package.json');

  return gulp
    .src(config.path.source + 'pug/*.pug')
    .pipe(
      pug({ pretty: true }).on('error', function(err) {
        console.log(err);
        this.emit('end');
      })
    )
    .pipe(replace(/\{\%version\%\}/g, 'v' + pkg.version))
    .pipe(replace(/\{\%year\%\}/g, new Date().getFullYear()))
    .pipe(gulp.dest(config.path.build));
});

/**
 * Makes easier to watch pug files
 */
gulp.task('build:pug-watch', gulp.series('build:pug'), sync.reload);

/**
 * Transpiles the javascript source-code.
 */
gulp.task('build:javascript', (cb) => {
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

  cb();
});

/**
 * Watches source-code file changes.
 * For development.
 */
gulp.task(
  'watch',
  gulp.series(
    gulp.parallel('build:style', 'build:sass', 'build:pug', 'build:javascript'),
    'build:images',
    (cb) => {
      sync.init({
        open: false,
        notify: false,
        port: 9000,
        server: {
          baseDir: './build'
        }
      });

      gulp.watch(
        config.path.source + 'sass/sample.scss',
        gulp.series('build:style')
      );

      gulp.watch(
        config.path.source + 'sass/**/*.scss',
        gulp.series('build:sass')
      );

      gulp.watch(
        config.path.source + 'js/**/*.js',
        gulp.series('build:javascript')
      );

      gulp.watch(
        config.path.source + 'pug/**/*.pug',
        gulp.series('build:pug-watch')
      );

      gulp.watch(
        config.path.source + 'images/**/*',
        gulp.series('build:images')
      );

      gulp
        .watch(config.path.build + 'assets/images/**/*')
        .on('change', sync.reload);

      cb();
    }
  )
);

gulp.task('dist:run', (cb) => {
  // updates the version
  const pkg = updatePackVersion(require('./package.json'));

  // prepare files header
  const comment =
    '/** \n ' +
    '* <%= pkg.name %> \n ' +
    '* <%= pkg.description %> \n ' +
    '* @author <%= pkg.author %> \n ' +
    '* @copyright 2016-' +
    new Date().getFullYear() +
    ', <%= pkg.author %> \n ' +
    '* @license <%= pkg.license %> \n ' +
    '* @version <%= pkg.version %> \n ' +
    '*/ \n\n ';

  gulp
    .src(config.path.build + 'assets/css/seed.css')
    .pipe(minify())
    .pipe(header(comment, { pkg: pkg }))
    .pipe(gulp.dest(config.path.dist));

  gulp
    .src(config.path.build + 'assets/js/seed-css.js')
    // .pipe(rename('seed-css.js'))
    // .pipe(uglify())
    .pipe(header(comment, { pkg: pkg }))
    .pipe(gulp.dest(config.path.dist));

  cb();
});

/**
 * Creates the distribution pack.
 */
gulp.task(
  'dist',
  gulp.series(
    'clean:dist',
    gulp.parallel('build:sass', 'build:javascript', 'build:pug'),
    'dist:run'
  )
);

gulp.task('default', gulp.series('clean', 'watch'));
