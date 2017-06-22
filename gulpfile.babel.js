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

const sourceDir = "./src/",
			devDir = "./dev/",
			distDir = "./dist/";


gulp.task('sass', () => {
	return gulp.src(sourceDir + "scss/+(styles.scss|fonts.scss)")
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 10 versions'],
		cascade: false
	}))
	.pipe(gulp.dest(devDir + "css"))
	.pipe(sync.stream())
	.pipe(cssmin())
	.pipe(gulp.dest(distDir + "css"));
});

gulp.task('pug', () => {
  return gulp.src(sourceDir + "pug/*.pug")
  .pipe(pug({
    pretty: true
  }))
  .on('error', console.log)
  .pipe(gulp.dest(devDir))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(distDir));
});



gulp.task('scripts-libs-minify', () => {
	return gulp.src([
		sourceDir + "scripts/plugins/*.js",
		sourceDir + "libs/jquery/dist/jquery.min.js",
		sourceDir + "libs/svg4everybody/dist/svg4everybody.min.js"
	])
	.pipe(concat('libs.js'))
	.pipe(uglify())
	.pipe(gulp.dest(distDir + "js/"))
	.pipe(gulp.dest(devDir + "js/"));
});

gulp.task('scripts-minify', () => {
	return browserify({
		entries: [sourceDir + "scripts/_main.js"]
	})
	.transform(babelify, {presets: ['es2015']})
	.bundle()
	.pipe(source("bundle.js"))
	.pipe(gulp.dest(devDir + "js/"))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest(distDir + "js/"));
});

gulp.task('sync', () => {
	sync.init({
		server: {baseDir: devDir}
	});
});

gulp.task('craft-svg', () => {
	del(sourceDir + 'scss/common/_sprites.scss');
	return gulp.src(sourceDir + "icons/*.svg")
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
				sprite: "../sprites.svg",
				render: {
					scss: {
						dest: "../../../src/scss/common/_sprites.scss",
						template: sourceDir + "scss/common/_sprites_layout.scss"
					}
				}
			}
		}
	}))
	.pipe(gulp.dest(distDir + "img/"))
	.pipe(gulp.dest(devDir + "img/"));
});

gulp.task('copy-img', () => {
	return gulp.src(sourceDir + "img/**/+(*.svg|*.png|*.jpg|*.gif|*.ico)")
	.pipe(imgmin())
	.pipe(gulp.dest(distDir + "img/"))
	.pipe(gulp.dest(devDir + "img/"));
});

gulp.task('copy-favicon-refs', () => {
	return gulp.src(sourceDir + "img/favicon/+(browserconfig.xml|manifest.json)")
	.pipe(gulp.dest(distDir + "img/favicon/"))
	.pipe(gulp.dest(devDir + "img/favicon/"));
});

gulp.task('copy-fonts', () => {
	return gulp.src(sourceDir + "fonts/+(*.ttf|*.eot|*.otf|*.woff|*.woff2)")
	.pipe(gulp.dest(distDir + "fonts/"))
	.pipe(gulp.dest(devDir + "fonts/"));
});

gulp.task('watch', () => {

	gulp.watch(sourceDir + "scss/**/*.scss", ['sass']);
	gulp.watch(sourceDir + "pug/**/*.pug", ['pug', sync.reload]);
	gulp.watch(sourceDir + "scripts/*.js", ['scripts-minify', sync.reload]);
	gulp.watch(sourceDir + "icons/*.svg", ['craft-svg', sync.reload]);
	gulp.watch(sourceDir + "img/**/*", ['copy-img', sync.reload]);
	gulp.watch(sourceDir + "fonts/*", ['copy-fonts', sync.reload]);
});

gulp.task('default', () => {
	runSequence(['craft-svg', 'copy-img', 'copy-fonts', 'copy-favicon-refs'],
							['sass', 'pug', 'scripts-libs-minify', 'scripts-minify'],
							'sync',
							'watch');
});

gulp.task('build', () => {
	runSequence(['craft-svg', 'copy-img', 'copy-fonts', 'copy-favicon-refs'],
							['sass', 'pug', 'scripts-libs-minify', 'scripts-minify']);
});

gulp.task('help', () => {
	console.log();
	console.log("***************************************");
	console.log();
	console.log("'src' folder contains all sources and non-processing files");
	console.log("'dist' folder - final folder(production folder), it's result");
	console.log("'dev' folder - not minimized filez for work and debugging");
	console.log();
	console.log("***************************************");
	console.log();
});