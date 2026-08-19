#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require( 'fs' );
const path = require( 'path' );
const { execFileSync } = require( 'child_process' );

const pluginRoot = 'content-control';

const requiredPaths = [
	'content-control.php',
	'readme.txt',
	'dist/settings-page.js',
	'dist/settings-page.css',
	'vendor/autoload.php',
];

const forbiddenPathPrefixes = [
	'.git/',
	'.github/',
	'.svn/',
	'__MACOSX/',
	'bin/',
	'docs/',
	'node_modules/',
	'packages/',
	'tests/',
];

/**
 * Convert an archive entry to a path relative to the plugin root.
 *
 * @param {string} entry Archive entry.
 * @return {string} Relative path.
 */
function relativeArtifactPath( entry ) {
	const prefix = `${ pluginRoot }/`;
	const normalized = entry.replace( /\\/g, '/' ).replace( /\/$/, '' );

	return normalized.startsWith( prefix )
		? normalized.slice( prefix.length )
		: normalized;
}

/**
 * Verify that every archive entry is safely contained by one plugin root.
 *
 * @param {string[]} entries Archive entries.
 * @return {string[]} Failures.
 */
function verifyArchiveStructure( entries ) {
	const failures = [];
	const seenEntries = new Set();

	for ( const entry of entries ) {
		const normalized = entry.replace( /\\/g, '/' );
		const pathWithoutTrailingSlash = normalized.replace( /\/$/, '' );
		const pathParts = pathWithoutTrailingSlash.split( '/' );

		if (
			entry !== normalized ||
			normalized.startsWith( '/' ) ||
			pathWithoutTrailingSlash.includes( '//' ) ||
			pathParts.includes( '.' ) ||
			pathParts.includes( '..' )
		) {
			failures.push( `unsafe archive path: ${ entry }` );
		}

		if (
			pluginRoot !== pathWithoutTrailingSlash &&
			! normalized.startsWith( `${ pluginRoot }/` )
		) {
			failures.push( `unexpected archive root: ${ entry }` );
		}

		if ( seenEntries.has( normalized ) ) {
			failures.push( `duplicate archive path: ${ entry }` );
		}

		seenEntries.add( normalized );
	}

	return [ ...new Set( failures ) ];
}

/**
 * Whether a Composer file belongs to the minimal runtime autoloader copied by
 * this repository's release builder.
 *
 * @param {string} relativePath Path relative to the plugin root.
 * @return {boolean} Whether the path is allowed.
 */
function isAllowedRuntimeVendorPath( relativePath ) {
	return (
		'vendor' === relativePath ||
		'vendor/' === relativePath ||
		'vendor/composer' === relativePath ||
		'vendor/composer/' === relativePath ||
		'vendor/autoload.php' === relativePath ||
		/^vendor\/composer\/[^/]+\.(?:php|json)$/i.test( relativePath )
	);
}

/**
 * Verify that the release contains only distributable paths.
 *
 * @param {string[]} entries Archive or release-tree entries.
 * @return {string[]} Failures.
 */
function verifyReleaseManifest( entries ) {
	const failures = [];
	const relativePaths = new Set( entries.map( relativeArtifactPath ) );

	for ( const requiredPath of requiredPaths ) {
		if ( ! relativePaths.has( requiredPath ) ) {
			failures.push( `missing release path: ${ requiredPath }` );
		}
	}

	for ( const relativePath of relativePaths ) {
		const pathParts = relativePath.split( '/' );
		const fileName = pathParts[ pathParts.length - 1 ];
		const hasForbiddenPrefix = forbiddenPathPrefixes.some( ( prefix ) =>
			relativePath.startsWith( prefix )
		);
		const hasForbiddenVendorPath =
			relativePath.startsWith( 'vendor/' ) &&
			! isAllowedRuntimeVendorPath( relativePath );
		const isRootMarkdown = /^[^/]+\.md$/i.test( relativePath );
		const isPlatformJunk =
			'.DS_Store' === fileName ||
			'Thumbs.db' === fileName ||
			fileName.startsWith( '._' );

		if (
			hasForbiddenPrefix ||
			hasForbiddenVendorPath ||
			isRootMarkdown ||
			isPlatformJunk
		) {
			failures.push( `forbidden release path: ${ relativePath }` );
		}
	}

	return [ ...new Set( failures ) ];
}

/**
 * Verify that ZIP entries are regular files or directories only.
 *
 * @param {string[]} entries    Archive entries.
 * @param {string[]} entryTypes Entry type characters from unzip.
 * @return {string[]} Failures.
 */
function verifyArchiveEntryTypes( entries, entryTypes ) {
	if ( entryTypes.length !== entries.length ) {
		return [
			`could not verify archive entry types: expected ${ entries.length }, found ${ entryTypes.length }`,
		];
	}

	return entryTypes.flatMap( ( entryType, index ) => {
		const entry = entries[ index ];

		if (
			( 'd' === entryType && ! entry.endsWith( '/' ) ) ||
			( '-' === entryType && entry.endsWith( '/' ) )
		) {
			return [ `archive entry type/name mismatch in ${ entry }` ];
		}

		return '-' === entryType || 'd' === entryType
			? []
			: [ `forbidden archive entry type in ${ entry }` ];
	} );
}

/**
 * Verify a release ZIP's structure and manifest.
 *
 * Plugin Check owns WordPress.org policy validation. This verifier only
 * protects the release archive boundary produced by this repository.
 *
 * @param {string} zipPath ZIP path.
 * @return {{entries:string[],failures:string[]}} Verification result.
 */
function verifyZip( zipPath ) {
	if ( ! fs.existsSync( zipPath ) ) {
		throw new Error( `Artifact not found: ${ zipPath }` );
	}

	const entries = execFileSync( 'unzip', [ '-Z1', zipPath ], {
		encoding: 'utf8',
	} )
		.split( '\n' )
		.filter( Boolean );
	const listing = execFileSync( 'unzip', [ '-Z', '-l', zipPath ], {
		encoding: 'utf8',
	} );
	const entryTypes = listing
		.split( '\n' )
		.filter( ( line ) => /^[bcdlps-].{9}\s/.test( line ) )
		.map( ( line ) => line.charAt( 0 ) );
	const failures = [
		...verifyArchiveStructure( entries ),
		...verifyArchiveEntryTypes( entries, entryTypes ),
		...verifyReleaseManifest( entries ),
	];

	return { entries, failures: [ ...new Set( failures ) ] };
}

/**
 * Collect every regular file in an assembled release tree.
 *
 * @param {string} root      Release root.
 * @param {string} directory Current directory.
 * @return {string[]} Relative file paths.
 */
function walkTree( root, directory ) {
	const entries = [];

	for ( const directoryEntry of fs.readdirSync( directory, {
		withFileTypes: true,
	} ) ) {
		const entryPath = path.join( directory, directoryEntry.name );
		const relativePath = path
			.relative( root, entryPath )
			.replace( /\\/g, '/' );

		if ( directoryEntry.isDirectory() ) {
			entries.push( ...walkTree( root, entryPath ) );
		} else if ( directoryEntry.isFile() ) {
			entries.push( relativePath );
		} else {
			entries.push( relativePath );
		}
	}

	return entries;
}

/**
 * Verify an assembled release tree before it is zipped or deployed to SVN.
 *
 * @param {string} releaseRoot Release root.
 * @return {{entries:string[],failures:string[]}} Verification result.
 */
function verifyReleaseTree( releaseRoot ) {
	if ( ! fs.existsSync( releaseRoot ) ) {
		throw new Error( `Release tree not found: ${ releaseRoot }` );
	}

	const entries = walkTree( releaseRoot, releaseRoot );
	const symlinkFailures = entries
		.filter( ( entry ) =>
			fs.lstatSync( path.join( releaseRoot, entry ) ).isSymbolicLink()
		)
		.map( ( entry ) => `forbidden release symlink: ${ entry }` );
	const failures = [
		...symlinkFailures,
		...verifyReleaseManifest( entries ),
	];

	return { entries, failures: [ ...new Set( failures ) ] };
}

function main() {
	const treeMode = '--release-tree' === process.argv[ 2 ];
	const targetPath = path.resolve(
		treeMode
			? process.argv[ 3 ] || path.join( process.cwd(), 'build' )
			: process.argv[ 2 ] ||
					path.join( process.cwd(), `${ pluginRoot }-latest.zip` )
	);
	const { entries, failures } = treeMode
		? verifyReleaseTree( targetPath )
		: verifyZip( targetPath );

	if ( failures.length ) {
		console.error( 'Release artifact verification failed:' );
		for ( const failure of failures ) {
			console.error( `- ${ failure }` );
		}
		process.exitCode = 1;
		return;
	}

	console.log(
		`Release artifact verification passed (${ entries.length } entries checked).`
	);
}

if ( require.main === module ) {
	main();
}

module.exports = {
	isAllowedRuntimeVendorPath,
	relativeArtifactPath,
	verifyArchiveEntryTypes,
	verifyArchiveStructure,
	verifyReleaseManifest,
	verifyReleaseTree,
	verifyZip,
};

/* eslint-enable no-console */
