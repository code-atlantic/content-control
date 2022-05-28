const gulp = require('gulp'),
	runSequence = require('run-sequence').use(gulp),
	$fn = require('gulp-load-plugins')({ camelize: true }),
	plumberErrorHandler = {
		errorHandler: $fn.notify.onError({
			title: 'Gulp',
			message: 'Error: <%= error.message %>',
		}),
	},
	pkg = require('./package.json');

//region JavaScript
gulp.task('js:settingspage', function () {
	return gulp
		.src([
			'assets/scripts/src/admin/plugins/serialize-object.js',
			'assets/scripts/src/admin/plugins/select2.full.custom.js',
			'assets/scripts/src/admin/settings-page.js',
		])
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.jshint())
		.pipe($fn.jshint.reporter('default'))
		.pipe(
			$fn.order(['plugins/**/*.js', '*.js'], {
				base: 'assets/scripts/src/admin/',
			})
		)
		.pipe($fn.concat('settings-page.js'))
		.pipe(gulp.dest('assets/scripts'))
		.pipe($fn.uglify())
		.pipe($fn.rename({ extname: '.min.js' }))
		.pipe(gulp.dest('assets/scripts'));
});

gulp.task('js:widgets', function () {
	return gulp
		.src(['assets/scripts/src/admin/widget-editor.js'])
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.jshint())
		.pipe($fn.jshint.reporter('default'))
		.pipe(gulp.dest('assets/scripts'))
		.pipe($fn.uglify())
		.pipe($fn.rename({ extname: '.min.js' }))
		.pipe(gulp.dest('assets/scripts'));
});

//region JavaScript
gulp.task('js:admin', function () {
	return (
		gulp
			.src([
				'assets/scripts/src/admin/vendor/*.js',
				'assets/scripts/src/admin/plugins/**/*.js',
				'assets/scripts/src/admin/*.js',
			])
			.pipe($fn.plumber(plumberErrorHandler))
			.pipe($fn.jshint())
			.pipe($fn.jshint.reporter('default'))
			.pipe(
				$fn.order(['vendor/**/*.js', 'plugins/**/*.js', '*.js'], {
					base: 'assets/scripts/src/admin/',
				})
			)
			//.pipe($fn.concat('admin.js'))
			.pipe(gulp.dest('assets/scripts'))
			.pipe($fn.uglify())
			.pipe($fn.rename({ extname: '.min.js' }))
			.pipe(gulp.dest('assets/scripts'))
	);
});

gulp.task('js:site', function () {
	return gulp
		.src([
			'assets/scripts/src/site/plugins/**/*.js',
			'assets/scripts/src/site/general.js',
		])
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.jshint())
		.pipe($fn.jshint.reporter('default'))
		.pipe(
			$fn.order(
				[
					'plugins/compatibility.js',
					'plugins/pum.js',
					'plugins/**/*.js',
					'general.js',
				],
				{ base: 'assets/scripts/src/site/' }
			)
		)
		.pipe($fn.concat('site.js'))
		.pipe(gulp.dest('assets/scripts'))
		.pipe($fn.uglify())
		.pipe($fn.rename({ extname: '.min.js' }))
		.pipe(gulp.dest('assets/scripts'));
});

gulp.task('js:other', function () {
	return gulp
		.src('assets/scripts/src/*.js')
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.jshint())
		.pipe($fn.jshint.reporter('default'))
		.pipe(gulp.dest('assets/scripts'))
		.pipe($fn.uglify())
		.pipe($fn.rename({ extname: '.min.js' }))
		.pipe(gulp.dest('assets/scripts'));
});

gulp.task('js', ['js:widgets', 'js:settingspage', 'js:site', 'js:other']);
//endregion JavaScript

//region Language Files
gulp.task('langpack', function () {
	return gulp
		.src(['**/*.php', '!build/**/*.*'])
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.sort())
		.pipe(
			$fn.wpPot({
				domain: pkg.name,
				bugReport: 'support@code-atlantic.com',
				team: 'Code Atlantic Support <support@code-atlantic.com>',
			})
		)

		.pipe(gulp.dest('languages'));
});
//endregion Language Files

//region SASS & CSS
gulp.task('css', function () {
	return gulp
		.src('assets/styles/sass/*.scss')
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.sourcemaps.init())
		.pipe(
			$fn.sass({
				errLogToConsole: true,
				outputStyle: 'expanded',
				precision: 10,
			})
		)
		.pipe($fn.sourcemaps.write())
		.pipe(
			$fn.sourcemaps.init({
				loadMaps: true,
			})
		)
		.pipe(
			$fn.autoprefixer(
				'last 2 version',
				'> 1%',
				'safari 5',
				'ie 8',
				'ie 9',
				'opera 12.1',
				'ios 6',
				'android 4'
			)
		)
		.pipe($fn.sourcemaps.write('.'))
		.pipe($fn.plumber.stop())
		.pipe(gulp.dest('assets/styles'))
		.pipe($fn.filter('**/*.css')) // Filtering stream to only css files
		.pipe($fn.combineMq()) // Combines Media Queries
		.pipe($fn.rename({ suffix: '.min' }))
		.pipe(
			$fn.csso({
				//sourceMap: true,
			})
		)
		.pipe(gulp.dest('assets/styles'));
});
//endregion SASS & CSS

//region Cleaners
gulp.task('clean-js:site', function () {
	return gulp
		.src('assets/scripts/site*.js', { read: false })
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.clean());
});
gulp.task('clean-js:admin', function () {
	return gulp
		.src('assets/scripts/admin*.js', { read: false })
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.clean());
});
gulp.task('clean-js:other', function () {
	return gulp
		.src(
			[
				'assets/scripts/*.js',
				'!assets/scripts/site*.js',
				'!assets/scripts/admin*.js',
			],
			{ read: false }
		)
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.clean());
});
gulp.task('clean-css', function () {
	return gulp
		.src(['assets/styles/*.css', 'assets/styles/*.css.map'], {
			read: false,
		})
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.clean());
});
gulp.task('clean-build', function () {
	return gulp
		.src('build/*', { read: false })
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.clean());
});
gulp.task('clean-package', function () {
	return gulp
		.src('release/' + pkg.name + '_v' + pkg.version + '.zip', {
			read: false,
		})
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.clean({ force: true }));
});

// Cleaning Routines
gulp.task('clean-js', function (done) {
	runSequence(['clean-js:site', 'clean-js:admin', 'clean-js:other'], done);
});
gulp.task('clean-all', function (done) {
	runSequence(
		['clean-js', 'clean-css'],
		['clean-build', 'clean-package'],
		done
	);
});
//endregion Cleaners

//region Watch & Build
gulp.task('watch', function () {
	gulp.watch('assets/styles/sass/**/*.scss', ['css']);
	//gulp.watch('assets/scripts/src/admin/**/*.js', ['js:admin']);
	gulp.watch('assets/scripts/src/site/**/*.js', ['js:site']);
	gulp.watch('assets/scripts/src/admin/**/*.js', ['js:settingspage']);
	gulp.watch('assets/scripts/src/admin/**/*.js', ['js:widgets']);
	gulp.watch(
		[
			'assets/scripts/src/**/*.js',
			'!assets/scripts/src/site/**/*.js',
			'!assets/scripts/src/admin/**/*.js',
		],
		['js:other']
	);
	gulp.watch('**/*.php', ['langpack']);
});

// Cleans & Rebuilds Assets Prior to Builds
gulp.task('prebuild', function (done) {
	runSequence('clean-all', ['css', 'js', 'langpack'], done);
});

// Copies a clean set of build files into the build folder
gulp.task('build', ['prebuild'], function () {
	return gulp
		.src([
			'./**/*.*',
			'!./build/**',
			'!./release/**',
			'!./node_modules/**',
			'!./gulpfile.js',
			'!./composer.json',
			'!./package.json',
			'!./readme.md',
			'!./assets/scripts/src/**',
			'!./assets/styles/sass/**',
		])
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe(gulp.dest('build/' + pkg.name));
});

// Generates a release package with the current version from package.json
gulp.task('package', ['clean-package'], function () {
	return gulp
		.src('build/**/*.*')
		.pipe($fn.plumber(plumberErrorHandler))
		.pipe($fn.zip(pkg.name + '_v' + pkg.version + '.zip'))
		.pipe(gulp.dest('release'));
});

// Runs all build routines and generates a release.
gulp.task('release', function (done) {
	runSequence('build', 'package', done);
});

// Runs a releaes and cleans up afterwards.
gulp.task('release:clean', ['release'], function (done) {
	runSequence('clean-build', done);
});
//endregion Watch & Build

gulp.task('default', function (done) {
	runSequence('prebuild', 'watch', done);
});
