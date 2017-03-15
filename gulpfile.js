var gulp =					require('gulp'),
		sass =					require('gulp-sass'),
    pug =           require('gulp-pug'),
		autoprefixer =	require('gulp-autoprefixer'),
		htmlmin =				require('gulp-htmlmin'),
		cssmin =				require('gulp-clean-css'),
		rename =				require('gulp-rename'),
		jsmin =					require('gulp-uglifyjs'),
		concat =				require('gulp-concat'),
		sync =					require('browser-sync').create(),
		svgsprite =			require('gulp-svg-sprite'),
		svgmin =				require('gulp-svgmin'),
		cheerio =				require('gulp-cheerio'),
		replace =				require('gulp-replace'),
		del =						require('del'),
		runSequence =		require('run-sequence'),
		imgmin =				require('gulp-imagemin');

var sourceDir = "./src/",
		devDir = "./dev/",
		distDir = "./dist/";


gulp.task('sass', function() {
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

gulp.task('pug', function() {
  return gulp.src(sourceDir + "pug/*.pug")
  .pipe(pug({
    pretty: true
  }))
  .on('error', console.log)
  .pipe(gulp.dest(devDir))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(distDir));
});



gulp.task('scripts-libs-minify', function() {
	return gulp.src([
		sourceDir + "libs/jquery/dist/jquery.min.js",
		sourceDir + "libs/svg4everybody/dist/svg4everybody.min.js",
		sourceDir + "libs/vue/dist/vue.js",
		sourceDir + "scripts/plugins/*.js",
		sourceDir + "libs/fetch/fetch.js",
		sourceDir + "libs/microplugin/src/microplugin.js",
		sourceDir + "libs/sifter/sifter.min.js",
		sourceDir + "libs/selectize/dist/js/selectize.min.js",
		sourceDir + "libs/jquery-mask-plugin/dist/jquery.mask.min.js"
		//add some libs
	])
	.pipe(concat('libs.js'))
	.pipe(jsmin({
		outSourceMap: false
	}))
	.pipe(gulp.dest(distDir + "js/"))
	.pipe(gulp.dest(devDir + "js/"));
});

gulp.task('scripts-minify', function() {
	return gulp.src([sourceDir + "scripts/main.js", sourceDir + "scripts/priority_*.js", sourceDir + "scripts/*.js"])
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest(devDir + "js/"))
	.pipe(jsmin())
	.pipe(gulp.dest(distDir + "js/"));
});

gulp.task('sync', function() {
	sync.init({
		server: {baseDir: devDir}
	});
});

gulp.task('craft-svg', function() {
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

gulp.task('copy-img', function() {
	return gulp.src(sourceDir + "img/**/+(*.svg|*.png|*.jpg|*.gif|*.ico)")
	.pipe(imgmin())
	.pipe(gulp.dest(distDir + "img/"))
	.pipe(gulp.dest(devDir + "img/"));
});

gulp.task('copy-favicon-refs', function() {
	return gulp.src(sourceDir + "img/favicon/+(browserconfig.xml|manifest.json)")
	.pipe(gulp.dest(distDir + "img/favicon/"))
	.pipe(gulp.dest(devDir + "img/favicon/"));
});

gulp.task('copy-fonts', function() {
	return gulp.src(sourceDir + "fonts/*.ttf")
	.pipe(gulp.dest(distDir + "fonts/"))
	.pipe(gulp.dest(devDir + "fonts/"))
});

gulp.task('watch', function() {

	gulp.watch(sourceDir + "scss/**/*.scss", ['sass']);
	gulp.watch(sourceDir + "pug/**/*.pug", ['pug', sync.reload]);
	gulp.watch(sourceDir + "scripts/*.js", ['scripts-minify', sync.reload]);
	gulp.watch(sourceDir + "icons/*.svg", ['craft-svg', sync.reload]);
	gulp.watch(sourceDir + "img/**/*", ['copy-img', sync.reload]);
	gulp.watch(sourceDir + "fonts/*.ttf", ['copy-fonts', sync.reload]);
});

gulp.task('default', function() {
	runSequence(['craft-svg', 'copy-img', 'copy-fonts', 'copy-favicon-refs'],
							['sass', 'pug', 'scripts-libs-minify', 'scripts-minify'],
							'sync',
							'watch');
});

gulp.task('build', function() {
	runSequence(['craft-svg', 'copy-img', 'copy-fonts', 'copy-favicon-refs'],
							['sass', 'pug', 'scripts-libs-minify', 'scripts-minify']);
});

gulp.task('help', function() {
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