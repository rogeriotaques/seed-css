const gulp = require('gulp');
const sync = require('browser-sync');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const beautify = require('gulp-cssbeautify');
const minify = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const pug = require('gulp-pug');
const replace = require('gulp-replace');
const header = require('gulp-header');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const fs = require('fs');
const util = require('minimist')(process.argv);

// @use npm run dist -- --[major|minor]
// let runFlag = 'patch';

// @use npm run dist -- --[development|staging|production]
let envFlag = 'development';

// if (util.major !== undefined) {
//   runFlag = 'major';
// } else if (util.minor !== undefined) {
//   runFlag = 'minor';
// }

if (util.staging !== undefined) {
  envFlag = 'staging';
} else if (util.production !== undefined) {
  envFlag = 'production';
}

const config = {
  fileName: 'seed',
  path: {
    source: 'source/',
    build: 'build/',
    dist: 'dist/'
  }
};

// const updatePackVersion = (pkg) => {
//   const v = pkg.version.split('.');

//   switch (runFlag) {
//     case 'major':
//       // increase major version
//       v[0] = parseInt(v[0]) + 1;
//       v[1] = 0;
//       v[2] = 0;
//       pkg.version = v.join('.');
//       break;

//     case 'minor':
//       // increase minor version
//       v[1] = parseInt(v[1]) + 1;
//       v[2] = 0;
//       pkg.version = v.join('.');
//       break;

//     default:
//       // patch
//       // increase patch version
//       v[2] = parseInt(v[2]) + 1;
//       pkg.version = v.join('.');
//       break;
//   }

//   // write down the new version into package.json file.
//   fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

//   // return new package
//   return pkg;
// };

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
gulp.task('build:website-images', () =>
  gulp
    .src(config.path.source + 'images/**/*')
    .pipe(gulp.dest(config.path.build + 'assets/images'))
);

/**
 * Builds the sample page styling
 */
gulp.task('build:website-style', () =>
  gulp
    .src(config.path.source + 'sass/sample.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(beautify({ indent: '  ', autosemicolon: true }))
    .pipe(concat('style.css'))
    .pipe(gulpif(envFlag === 'production', minify()))
    .pipe(gulp.dest(config.path.build + 'assets/css'))
    .pipe(sync.reload({ stream: true }))
);

/**
 * Builds the product styling
 */
gulp.task('build:sass', (cb) => {
  gulp
    .src([
      `${config.path.source}sass/includes/_normalize.scss`,
      `${config.path.source}sass/main.scss`
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(beautify({ indent: '  ', autosemicolon: true }))
    .pipe(gulpif(envFlag === 'production', minify()))
    .pipe(concat(`${config.fileName}.css`))
    .pipe(gulp.dest(`${config.path.build}assets/css`))
    .pipe(sync.reload({ stream: true }));

  cb();
});

/**
 * Builds the HTML pages
 */
gulp.task('build:website', (cb) => {
  const pkg = require('./package.json');

  gulp
    .src(config.path.source + 'pug/*.pug')
    .pipe(
      pug({ pretty: true }).on('error', function(err) {
        console.log('#### PUG ERROR ####', err, '#### #### ####');
        this.emit('end');
      })
    )
    .pipe(replace(/\{\%version\%\}/g, 'v' + pkg.version))
    .pipe(replace(/\{\%year\%\}/g, new Date().getFullYear()))
    .pipe(gulp.dest(config.path.build));

  cb();
});

/**
 * Makes easier to watch pug files
 */
gulp.task(
  'build:pug-watch',
  gulp.series('build:website', (cb) => {
    sync.reload();
    cb();
  })
);

/**
 * Transpiles the website javascript.
 */
gulp.task('build:website-js', (cb) => {
  const babelOptions = { presets: ['@babel/env'] };

  const onUglifyErr = (err) => {
    console.error('#### ERROR IN build:website-js TASK ####', err.toString());
  };

  gulp
    .src([
      config.path.source + 'js/components/*.js',
      config.path.source + 'js/*.js'
    ])
    .pipe(gulpif(envFlag === 'production', sourcemaps.init()))
    .pipe(babel(babelOptions))
    .pipe(gulpif(envFlag === 'production', uglify().on('error', onUglifyErr)))
    .pipe(concat('bundle.js'))
    .pipe(gulpif(envFlag === 'production', sourcemaps.write()))
    .pipe(gulp.dest(config.path.build + 'assets/js'))
    .pipe(sync.reload({ stream: true }));

  cb();
});

/**
 * Transpiles the javascript source-code.
 */
gulp.task('build:javascript', (cb) => {
  const babelOptions = { presets: ['@babel/env'] };

  const onUglifyErr = (err) => {
    console.error('#### ERROR IN build:javascript TASK ####', err.toString());
  };

  gulp
    .src([config.path.source + 'js/components/*.js'])
    .pipe(gulpif(envFlag === 'production', sourcemaps.init()))
    .pipe(babel(babelOptions))
    .pipe(gulpif(envFlag === 'production', uglify().on('error', onUglifyErr)))
    .pipe(concat('seedcss.js'))
    .pipe(gulpif(envFlag === 'production', sourcemaps.write()))
    .pipe(gulp.dest(config.path.build + 'assets/js'));
  // .pipe(sync.reload({ stream: true }))

  cb();
});

/**
 * Watches source-code file changes.
 * For development.
 */
gulp.task(
  'watch',
  gulp.series(
    gulp.parallel('build:website-style', 'build:website-js', 'build:website'),
    'build:website-images',
    gulp.parallel('build:sass', 'build:javascript'),
    (cb) => {
      sync.init({
        open: true,
        notify: false,
        port: 9000,
        server: {
          baseDir: './build'
        }
      });

      // Watch changes on website styling
      gulp.watch(
        config.path.source + 'sass/sample.scss',
        gulp.series('build:website-style')
      );

      // Watch changes on website JS
      gulp.watch(
        config.path.source + 'js/**/*.js',
        gulp.series('build:javascript', 'build:website-js')
      );

      // Watch changes on Seed styling
      gulp.watch(
        config.path.source + 'sass/**/*.scss',
        gulp.series('build:sass')
      );

      // Watch changes on the website page
      gulp.watch(
        config.path.source + 'pug/**/*.pug',
        gulp.series('build:pug-watch')
      );

      // Watch changes on any new image (assets)
      gulp.watch(
        config.path.source + 'images/**/*',
        gulp.series('build:website-images')
      );

      // Reloads the browser is any image is placed on assets
      gulp
        .watch(config.path.build + 'assets/images/**/*')
        .on('change', sync.reload);

      cb();
    }
  )
);

gulp.task('dist:run', (cb) => {
  // updates the version
  // const pkg = updatePackVersion(require('./package.json'));
  const pkg = require('./package.json');

  // prepare files header
  const comment =
    '/*! \n ' +
    '* Seed CSS (<%= pkg.name %>) \n ' +
    '* <%= pkg.description %> \n ' +
    '* @author <%= pkg.author %> \n ' +
    '* @copyright 2016-' +
    new Date().getFullYear() +
    ', <%= pkg.author %> \n ' +
    '* @license <%= pkg.license %> \n ' +
    '* @version <%= pkg.version %> \n ' +
    '*/ \n\n ';

  // Copy the SASS source-code to the distribution folder
  // This will help developers to customize it or only load what they need.
  gulp
    .src([
      `${config.path.source}sass/components/*.scss`,
      `${config.path.source}sass/includes/*.scss`,
      `${config.path.source}sass/+(main|essential).scss`
    ])
    .pipe(gulp.dest(`${config.path.dist}src/sass`));

  // Copy the Javascript source-code to the distribution folder
  // This will help developers to customize it or only load what they need.
  gulp
    .src(`${config.path.source}js/components/*.js`)
    .pipe(gulp.dest(`${config.path.dist}src/js`));

  // Buy some time to the script complete writing the files in the disk
  // before write the distribution header in the files. Think 1.5 seconds to be enough.
  setTimeout(() => {
    gulp
      .src(`${config.path.build}assets/css/seed.css`)
      .pipe(header(comment, { pkg: pkg }))
      .pipe(gulp.dest(config.path.dist));

    gulp
      .src(`${config.path.build}assets/js/seedcss.js`)
      .pipe(header(comment, { pkg: pkg }))
      .pipe(gulp.dest(config.path.dist));

    cb();
  }, 1500);
});

/**
 * Creates the distribution pack.
 */
gulp.task(
  'build',
  gulp.series(
    'clean:dist',
    gulp.parallel(
      'build:sass',
      'build:javascript',
      'build:website',
      'build:website-style',
      'build:website-js'
    ),
    'dist:run'
  )
);

gulp.task('default', gulp.series('clean', 'watch'));
