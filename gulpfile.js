const gulp = require('gulp');
const babel = require('gulp-babel');
const terser = require('gulp-terser');


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
gulp.task('post-build', gulp.series('babel-transpile', 'minify-scripts'));
