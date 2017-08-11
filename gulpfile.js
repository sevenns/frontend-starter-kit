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

var src = './src/',
		dev = './dev/',
		dist = './dist/';


gulp.task('sass', function() {
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

gulp.task('pug', function() {
  return gulp.src(src + 'pug/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .on('error', console.log)
  .pipe(gulp.dest(dev))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(dist));
});

gulp.task('scripts-libs-minify', function() {
	return gulp.src([
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/svg4everybody/dist/svg4everybody.min.js',
		src + 'scripts/plugins/*.js'
	])
	.pipe(concat('libs.js'))
	.pipe(jsmin({
		outSourceMap: false
	}))
	.pipe(gulp.dest(dist + "js/"))
	.pipe(gulp.dest(dev + "js/"));
});

gulp.task('scripts-minify', function() {
	return gulp.src([src + 'scripts/_settings.js', src + 'scripts/classes/*.js', src + 'scripts/_main.js', src + 'scripts/*.js'])
	.pipe(concat('bundle.js'))
	.pipe(gulp.dest(dev + 'js/'))
	.pipe(jsmin())
	.pipe(gulp.dest(dist + 'js/'));
});

gulp.task('sync', function() {
	sync.init({
		server: { baseDir: dev }
	});
});

gulp.task('craft-svg', function() {
	del(src + 'sass/common/_sprites.sass');
	return gulp.src(src + "icons/*.svg")
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

gulp.task('copy-img', function() {
	return gulp.src(src + 'img/**/+(*.svg|*.png|*.jpg|*.gif|*.ico)')
	.pipe(imgmin())
	.pipe(gulp.dest(dist + 'img/'))
	.pipe(gulp.dest(dev + 'img/'));
});

gulp.task('copy-favicon-refs', function() {
	return gulp.src(src + 'img/favicon/+(browserconfig.xml|manifest.json)')
	.pipe(gulp.dest(dist + 'img/favicon/'))
	.pipe(gulp.dest(dev + 'img/favicon/'));
});

gulp.task('copy-fonts', function() {
	return gulp.src(src + 'fonts/+(*.ttf|*.eot|*.otf|*.woff|*.woff2|*.svg)')
	.pipe(gulp.dest(dist + 'fonts/'))
	.pipe(gulp.dest(dev + 'fonts/'));
});

gulp.task('watch', function() {

	gulp.watch(src + 'sass/**/*.sass', ['sass']);
	gulp.watch(src + 'pug/**/*.pug', ['pug', sync.reload]);
	gulp.watch(src + 'scripts/*.js', ['scripts-minify', sync.reload]);
	gulp.watch(src + 'scripts/classes/**/*.js', ['scripts-minify', sync.reload]);
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

gulp.task('copy', function() {
	runSequence(['craft-svg', 'copy-img', 'copy-fonts', 'copy-favicon-refs']);
});

gulp.task('help', function() {
	console.log();
	console.log("***************************************");
	console.log();
	console.log("'src' folder contains all sources and non-processing files");
	console.log("'dist' folder - final folder(production folder), it's result");
	console.log("'dev' folder - not minimized files for work and debugging");
	console.log();
	console.log("***************************************");
	console.log();
});