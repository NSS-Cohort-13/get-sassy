'use strict'

const del = require('del')
const gulp = require('gulp')
const jshint = require('gulp-jshint')
const sass = require('gulp-sass')
const sassLint = require('gulp-sass-lint')
const runSequence = require('run-sequence')

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
   gulp.watch(staticPath, ['build'])
))

gulp.task('static:copy', () => (
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

gulp.task('sass:compile', () => (
  gulp.src(sassPath)
    .pipe(sass())
    .pipe(gulp.dest(distributionPath))
))

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

// Composed Tasks

gulp.task('build', () => (
  runSequence('clean', ['sass:compile', 'static:copy'])
))
gulp.task('watch', ['build', 'static:watch', 'js:watch', 'sass:watch'])
gulp.task('lint', ['js:lint', 'sass:lint'])
gulp.task('default', ['build'])
