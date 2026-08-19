const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );
const { execFileSync } = require( 'child_process' );

const {
	verifyArchiveEntryTypes,
	verifyArchiveStructure,
	verifyReleaseManifest,
	verifyReleaseTree,
	verifyZip,
} = require( '../../../bin/verify-release-artifact' );

describe( 'release artifact verifier', () => {
	test( 'accepts the assembled runtime files in a release ZIP', () => {
		const temporaryRoot = fs.mkdtempSync(
			path.join( os.tmpdir(), 'content-control-release-verifier-' )
		);
		const pluginRoot = path.join( temporaryRoot, 'content-control' );
		const zipPath = path.join( temporaryRoot, 'content-control.zip' );

		try {
			for ( const relativePath of [
				'content-control.php',
				'readme.txt',
				'dist/settings-page.js',
				'dist/settings-page.css',
				'vendor/autoload.php',
				'vendor/composer/autoload_real.php',
				'vendor/composer/installed.json',
			] ) {
				const filePath = path.join( pluginRoot, relativePath );
				fs.mkdirSync( path.dirname( filePath ), { recursive: true } );
				fs.writeFileSync( filePath, '<?php // Release fixture.' );
			}

			execFileSync( 'zip', [ '-qr', zipPath, 'content-control' ], {
				cwd: temporaryRoot,
			} );

			expect( verifyZip( zipPath ).failures ).toEqual( [] );
		} finally {
			fs.rmSync( temporaryRoot, { recursive: true, force: true } );
		}
	} );

	test( 'rejects unsafe, duplicate, and non-plugin archive roots', () => {
		expect(
			verifyArchiveStructure( [
				'content-control/',
				'content-control/classes/Rules.php',
				'content-control/classes/Rules.php',
				'decoy/classes/Rules.php',
				'content-control/../private.php',
			] )
		).toEqual(
			expect.arrayContaining( [
				'duplicate archive path: content-control/classes/Rules.php',
				'unexpected archive root: decoy/classes/Rules.php',
				'unsafe archive path: content-control/../private.php',
			] )
		);
	} );

	test( 'rejects mismatched and non-regular archive entry types', () => {
		expect(
			verifyArchiveEntryTypes(
				[
					'content-control/',
					'content-control/content-control.php',
					'content-control/linked.php',
				],
				[ '-', 'd', 'l' ]
			)
		).toEqual(
			expect.arrayContaining( [
				'archive entry type/name mismatch in content-control/',
				'archive entry type/name mismatch in content-control/content-control.php',
				'forbidden archive entry type in content-control/linked.php',
			] )
		);
	} );

	test( 'requires runtime files and rejects repository-only paths', () => {
		const failures = verifyReleaseManifest( [
			'content-control/content-control.php',
			'content-control/readme.txt',
			'content-control/vendor/autoload.php',
			'content-control/tests/fixture.php',
		] );

		expect( failures ).toEqual(
			expect.arrayContaining( [
				'missing release path: dist/settings-page.js',
				'missing release path: dist/settings-page.css',
				'forbidden release path: tests/fixture.php',
			] )
		);
	} );

	test( 'allows only the runtime Composer records copied by the build', () => {
		expect(
			verifyReleaseManifest( [
				'content-control/content-control.php',
				'content-control/readme.txt',
				'content-control/dist/settings-page.js',
				'content-control/dist/settings-page.css',
				'content-control/vendor/',
				'content-control/vendor/autoload.php',
				'content-control/vendor/composer/',
				'content-control/vendor/composer/autoload_real.php',
				'content-control/vendor/composer/installed.json',
			] )
		).toEqual( [] );

		expect(
			verifyReleaseManifest( [
				'content-control/vendor/library/source.php',
			] )
		).toContain( 'forbidden release path: vendor/library/source.php' );
	} );

	test( 'verifies an assembled release tree without inspecting implementation names', () => {
		const temporaryRoot = fs.mkdtempSync(
			path.join( os.tmpdir(), 'content-control-release-tree-' )
		);

		try {
			for ( const relativePath of [
				'content-control.php',
				'readme.txt',
				'dist/settings-page.js',
				'dist/settings-page.css',
				'vendor/autoload.php',
			] ) {
				const filePath = path.join( temporaryRoot, relativePath );
				fs.mkdirSync( path.dirname( filePath ), { recursive: true } );
				fs.writeFileSync( filePath, 'release fixture' );
			}

			expect( verifyReleaseTree( temporaryRoot ).failures ).toEqual( [] );
		} finally {
			fs.rmSync( temporaryRoot, { recursive: true, force: true } );
		}
	} );
} );
