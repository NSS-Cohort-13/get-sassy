'use strict'

const del = require('del')
const gulp = require('gulp')
const jshint = require('gulp-jshint')
const sass = require('gulp-sass')
const sassLint = require('gulp-sass-lint')

const sourcePath = './src'
const distributionPath = './dist'
const jsPath = `${sourcePath}/**/*.js`
const sassPath = `${sourcePath}/**/*.scss`
const staticPath = [`${sourcePath}/**/*`, `!${sassPath}`]

// Utilities

gulp.task('clean', () => (
  del(`${distributionPath}/**/*`)
))

// Static file Tasks

gulp.task('static:watch', () => (
   gulp.watch(staticPath, ['static:copy'])
))

gulp.task('static:copy', ['clean'], () => (
  gulp.src(staticPath)
    .pipe(gulp.dest(distributionPath))
))

// JavaScript Tasks

gulp.task('js:watch', () => (
  gulp.watch(jsPath, ['js:lint'])
))

gulp.task('js:lint', () => (
  gulp.src(jsPath)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
))

// Sass Tasks

const sassCompile = () => {
  gulp.src(sassPath)
    .pipe(sass())
    .pipe(gulp.dest(distributionPath))
}

gulp.task('sass:compileAndClean', ['clean'], sassCompile)
gulp.task('sass:compile', sassCompile)

gulp.task('sass:lint', () => (
  gulp.src(sassPath)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
))

gulp.task('sass:watch', () => (
  gulp.watch(sassPath,
    ['sass:lint', 'sass:compile']
  )
))

gulp.task('build', ['clean', 'sass:compileAndClean', 'static:copy'])
gulp.task('watch', ['static:watch', 'js:watch', 'sass:watch'])
gulp.task('lint', ['js:lint', 'sass:lint'])
gulp.task('default', ['build'])
