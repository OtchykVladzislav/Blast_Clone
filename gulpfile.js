const gulp = require('gulp');
const babel = require('gulp-babel');
const tinify = require('gulp-tinify');
const terser = require('gulp-terser');
const TINYPNG_API_KEY = 'your-tinypng-api-key';

// Минификация изображений после сборки
gulp.task('compress-images', () => {
  return gulp.src('build/web-mobile/**/*.{png,jpg,jpeg}')
    .pipe(tinify(TINYPNG_API_KEY))
    .pipe(gulp.dest('build/web-mobile'));
});

// Транспиляция JavaScript через Babel без .babelrc
gulp.task('babel-transpile', () => {
  return gulp.src('build/web-mobile/**/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest('build/web-mobile'));
});

// Минификация JavaScript после транспиляции
gulp.task('minify-scripts', () => {
  return gulp.src('build/web-mobile/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/web-mobile'));
});

// Основная задача для обработки ассетов после сборки
gulp.task('post-build', gulp.series('compress-images', 'babel-transpile', 'minify-scripts'));
