'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import pug from 'gulp-pug';
import autoprefixer from 'gulp-autoprefixer';
import htmlmin from 'gulp-htmlmin';
import cssmin from 'gulp-clean-css';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import buffer from 'vinyl-buffer';
import concat from 'gulp-concat';
import sync from 'browser-sync';
import svgsprite from 'gulp-svg-sprite';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import del from 'del';
import runSequence from 'run-sequence';
import imgmin from 'gulp-imagemin';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import gutil from 'gulp-util';

const src = './src/',
			dev = './dev/',
			dist = './dist/';


gulp.task('sass', () => {
	return gulp.src(src + 'sass/+(styles.sass|fonts.sass)')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 10 versions'],
		cascade: false
	}))
	.pipe(gulp.dest(dev + 'css'))
	.pipe(sync.stream())
	.pipe(cssmin())
	.pipe(gulp.dest(dist + 'css'));
});

gulp.task('pug', () => {
  return gulp.src(src + 'pug/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .on('error', console.log)
  .pipe(gulp.dest(dev))
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest(dist));
});

gulp.task('scripts-minify', () => {
	return browserify({
		entries: [src + 'scripts/_main.js']
	})
	.transform(babelify, { presets: ['es2015'] })
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(dev + 'js/'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest(dist + 'js/'));
});

gulp.task('sync', () => {
	sync.init({
		server: { baseDir: dev }
	});
});

gulp.task('craft-svg', () => {
	del(src + 'sass/common/_sprites.sass');
	return gulp.src(src + 'icons/*.svg')
	.pipe(svgmin({
		js2svg: { pretty: true }
	}))
	.pipe(cheerio({
		run: function($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
		},
		parserOptions: { xmlMode: true }
	}))
	.pipe(replace('&gt;', '>'))
	.pipe(svgsprite({
		mode: {
			symbol: {
				sprite: '../sprites.svg',
				render: {
					sass: {
						dest: '../../../src/sass/common/_sprites.sass',
						template: src + 'sass/common/_sprites_layout.sass'
					}
				}
			}
		}
	}))
	.pipe(gulp.dest(dist + 'img/'))
	.pipe(gulp.dest(dev + 'img/'));
});

gulp.task('copy-img', () => {
	return gulp.src(src + 'img/**/+(*.svg|*.png|*.jpg|*.gif|*.ico)')
	.pipe(imgmin())
	.pipe(gulp.dest(dist + 'img/'))
	.pipe(gulp.dest(dev + 'img/'));
});

gulp.task('copy-favicon-refs', () => {
	return gulp.src(src + 'img/favicon/+(browserconfig.xml|manifest.json)')
	.pipe(gulp.dest(dist + 'img/favicon/'))
	.pipe(gulp.dest(dev + 'img/favicon/'));
});

gulp.task('copy-fonts', () => {
	return gulp.src(src + 'fonts/+(*.ttf|*.eot|*.otf|*.woff|*.woff2|*.svg)')
	.pipe(gulp.dest(dist + 'fonts/'))
	.pipe(gulp.dest(dev + 'fonts/'));
});

gulp.task('watch', () => {
	gulp.watch(src + 'sass/**/*.sass', ['sass']);
	gulp.watch(src + 'pug/**/*.pug', ['pug', sync.reload]);
	gulp.watch(src + 'scripts/*.js', ['scripts-minify', sync.reload]);
});

gulp.task('default', () => {
	runSequence(['craft-svg', 'copy-img', 'copy-fonts', 'copy-favicon-refs'],
							['sass', 'pug', 'scripts-minify'],
							'sync',
							'watch');
});

gulp.task('build', () => {
	runSequence(['craft-svg', 'copy-img', 'copy-fonts', 'copy-favicon-refs'],
							['sass', 'pug', 'scripts-minify']);
});

gulp.task('copy', () => {
	runSequence(['craft-svg', 'copy-img', 'copy-fonts', 'copy-favicon-refs']);
});

gulp.task('help', () => {
	console.log();
	console.log('***************************************');
	console.log();
	console.log('\'src\' folder contains all sources and non-processing files');
	console.log('\'dist\' folder - final folder(production folder), it\'s result');
	console.log('\'dev\' folder - not minimized files for work and debugging');
	console.log();
	console.log('***************************************');
	console.log();
});