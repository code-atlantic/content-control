const gulp = require( 'gulp' ),
	$fn = require( 'gulp-load-plugins' )( { camelize: true } ),
	plumberErrorHandler = {
		errorHandler: $fn.notify.onError( {
			title: 'Gulp',
			message: 'Error: <%= error.message %>',
		} ),
	},
	pkg = require( './package.json' );

gulp.task( 'clean-build', function () {
	return gulp
		.src( 'build/*', { read: false } )
		.pipe( $fn.plumber( plumberErrorHandler ) )
		.pipe( $fn.clean() );
} );

gulp.task( 'clean-package', function () {
	return gulp
		.src( 'release/' + pkg.name + '_v' + pkg.version + '.zip', {
			read: false,
		} )
		.pipe( $fn.plumber( plumberErrorHandler ) )
		.pipe( $fn.clean( { force: true } ) );
} );

gulp.task( 'clean-all', function () {
	gulp.series(
		gulp.parallel( 'clean-js', 'clean-css' ),
		gulp.parallel( 'clean-build', 'clean-package' )
	);
} );
//endregion Cleaners

// Copies a clean set of build files into the build folder
gulp.task( 'build', function () {
	return gulp
		.src( [
			'./**/*.*',
			'!./build/**',
			'!./release/**',
			'!./node_modules/**',
			'!./gulpfile.js',
			'!./composer.json',
			'!./package.json',
			'!./assets/scripts/src/**',
		] )
		.pipe( $fn.plumber( plumberErrorHandler ) )
		.pipe( gulp.dest( 'build/' + pkg.name ) );
} );

// Generates a release package with the current version from package.json
gulp.task( 'package', function () {
	return gulp
		.src( 'build/**/*.*' )
		.pipe( $fn.plumber( plumberErrorHandler ) )
		.pipe( $fn.zip( pkg.name + '_v' + pkg.version + '.zip' ) )
		.pipe( gulp.dest( 'release' ) );
} );

// Runs all build routines and generates a release.
gulp.task( 'release', gulp.series( 'build', 'package' ) );

// Runs a releaes and cleans up afterwards.
gulp.task( 'release:clean', gulp.series( 'release', 'clean-build' ) );
//endregion Watch & Build
