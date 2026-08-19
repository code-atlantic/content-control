const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );
const { execFileSync } = require( 'child_process' );

const {
	verifyArchiveEntryTypes,
	verifyArchiveStructure,
	verifyArtifactEntries,
	verifyReleaseManifest,
	verifyZip,
} = require( '../../../bin/verify-wporg-artifact' );

describe( 'WordPress.org artifact verifier', () => {
	test( 'accepts the runtime Composer files in a release ZIP', () => {
		const temporaryRoot = fs.mkdtempSync(
			path.join( os.tmpdir(), 'content-control-wporg-verifier-' )
		);
		const pluginRoot = path.join( temporaryRoot, 'content-control' );
		const zipPath = path.join( temporaryRoot, 'content-control.zip' );

		try {
			for ( const relativePath of [
				'content-control.php',
				'classes/Plugin/License.php',
				'classes/RestAPI/License.php',
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
				'content-control/classes/Plugin/License.php',
				'content-control/classes/Plugin/License.php',
				'decoy/classes/Plugin/License.php',
				'content-control/../private.php',
			] )
		).toEqual(
			expect.arrayContaining( [
				'duplicate archive path: content-control/classes/Plugin/License.php',
				'unexpected archive root: decoy/classes/Plugin/License.php',
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

	test( 'allows runtime Composer records but rejects other vendor files', () => {
		expect(
			verifyReleaseManifest( [
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
				'content-control/tests/fixture.php',
			] )
		).toEqual(
			expect.arrayContaining( [
				'forbidden release path: vendor/library/source.php',
				'forbidden release path: tests/fixture.php',
			] )
		);
	} );

	test( 'allows the narrow old-Pro license field in public Core assets', () => {
		const contents = {
			'classes/Plugin/License.php': '<?php // Compatibility service.',
			'classes/RestAPI/License.php': '<?php // Compatibility controller.',
			'dist/settings-page.js':
				'Paste or enter your license key; activateLicense(); deactivateLicense();',
		};

		expect(
			verifyArtifactEntries( Object.keys( contents ), ( entry ) =>
				Buffer.from( contents[ entry ] )
			)
		).toEqual( [] );
	} );

	test( 'still rejects installer behavior beside the compatibility field', () => {
		const contents = {
			'classes/Plugin/License.php': '<?php // Compatibility service.',
			'classes/RestAPI/License.php': '<?php // Compatibility controller.',
			'dist/settings-page.js':
				'Paste or enter your license key; activatePro();',
		};

		expect(
			verifyArtifactEntries( Object.keys( contents ), ( entry ) =>
				Buffer.from( contents[ entry ] )
			)
		).toContain( 'installer-specific UI in dist/settings-page.js' );
	} );
} );
