#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require( 'fs' );
const path = require( 'path' );

function readFile( projectRoot, fileName ) {
	return fs.readFileSync( path.join( projectRoot, fileName ), 'utf8' );
}

function extractMatch( contents, pattern, label ) {
	const match = contents.match( pattern );

	if ( ! match ) {
		throw new Error( `Could not read ${ label }.` );
	}

	return match[ 1 ];
}

function compareVersions( left, right ) {
	const leftParts = left.split( '.' ).map( Number );
	const rightParts = right.split( '.' ).map( Number );

	for ( let index = 0; index < 3; index++ ) {
		if ( leftParts[ index ] !== rightParts[ index ] ) {
			return leftParts[ index ] - rightParts[ index ];
		}
	}

	return 0;
}

function hasValidDatedHeading( contents, pattern ) {
	const match = contents.match( pattern );

	if ( ! match ) {
		return false;
	}

	const month = Number( match[ 1 ] );
	const day = Number( match[ 2 ] );
	const year = Number( match[ 3 ] );
	const leapYear = 0 === year % 400 || ( 0 === year % 4 && 0 !== year % 100 );
	const daysInMonth = [
		31,
		leapYear ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31,
	];

	return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[ month - 1 ];
}

function validateReleaseVersion( {
	projectRoot = process.cwd(),
	version,
	previousVersion = '',
} ) {
	if ( ! /^\d+\.\d+\.\d+$/.test( version || '' ) ) {
		throw new Error( 'Release version must use stable X.Y.Z format.' );
	}

	if (
		previousVersion &&
		( ! /^\d+\.\d+\.\d+$/.test( previousVersion ) ||
			compareVersions( version, previousVersion ) <= 0 )
	) {
		throw new Error( `Release ${ version } must be newer than ${ previousVersion }.` );
	}

	const packageVersion = JSON.parse( readFile( projectRoot, 'package.json' ) ).version;
	const plugin = readFile( projectRoot, 'content-control.php' );
	const readme = readFile( projectRoot, 'readme.txt' );
	const changelog = readFile( projectRoot, 'CHANGELOG.md' );
	const versions = {
		'package.json': packageVersion,
		'content-control.php header': extractMatch(
			plugin,
			/^\s*\*\s*Version:\s*([^\s]+)\s*$/m,
			'plugin header version'
		),
		'content-control.php config': extractMatch(
			plugin,
			/'version'\s*=>\s*'([^']+)'/,
			'plugin config version'
		),
		'readme.txt stable tag': extractMatch(
			readme,
			/^Stable tag:\s*([^\s]+)\s*$/m,
			'readme stable tag'
		),
	};
	const mismatches = Object.entries( versions ).filter(
		( [ , found ] ) => found !== version
	);

	if ( mismatches.length ) {
		throw new Error(
			`Version mismatch: ${ mismatches
				.map( ( [ label, found ] ) => `${ label }=${ found }` )
				.join( ', ' ) }; expected ${ version }.`
		);
	}

	const escapedVersion = version.replace( /\./g, '\\.' );
	const date = '(\\d{2})/(\\d{2})/(\\d{4})';
	if (
		! hasValidDatedHeading(
			changelog,
			new RegExp( `^## v${ escapedVersion } - ${ date }$`, 'm' )
		)
	) {
		throw new Error( `CHANGELOG.md has no valid dated v${ version } entry.` );
	}
	if (
		! hasValidDatedHeading(
			readme,
			new RegExp( `^= v${ escapedVersion } - ${ date } =$`, 'm' )
		)
	) {
		throw new Error( `readme.txt has no valid dated v${ version } changelog entry.` );
	}

	return versions;
}

function getArgument( name ) {
	const index = process.argv.indexOf( name );
	return -1 === index ? '' : process.argv[ index + 1 ] || '';
}

if ( require.main === module ) {
	try {
		const version = getArgument( '--version' );
		const previousVersion = getArgument( '--previous-version' );
		validateReleaseVersion( { version, previousVersion } );
		console.log( `Release version ${ version } is consistent and valid.` );
	} catch ( error ) {
		console.error( error.message );
		process.exit( 1 );
	}
}

module.exports = { compareVersions, validateReleaseVersion };

/* eslint-enable no-console */
