var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sassGlob = require('gulp-sass-glob');
var csso = require('gulp-csso');

// SASS
gulp.task('sass', function () {
  return gulp.src('./src/sass/main.scss')
  .pipe(sassGlob())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
  .pipe(csso())
  .pipe(gulp.dest('./app/css'))
  .pipe(browserSync.reload({
      stream: true
    }));
});

// BrowserSync
gulp.task('server', function() {
    browserSync({
        port: 9000,
        server: {
            baseDir: "app"
        },
        notify: false
    });

    gulp.watch('./src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch([
      'app/*.html',
      'app/js/**/*.js',
      'app/css/**/*.css'
    ]).on('change', browserSync.reload);
});

// Задача по-умолчанию
gulp.task('default', gulp.series(['server', 'sass']));
