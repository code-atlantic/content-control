const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );

const {
	compareVersions,
	validateReleaseVersion,
} = require( '../../../bin/validate-release-version' );

describe( 'release version validation', () => {
	let projectRoot;

	beforeEach( () => {
		projectRoot = fs.mkdtempSync(
			path.join( os.tmpdir(), 'content-control-release-version-' )
		);
		fs.writeFileSync(
			path.join( projectRoot, 'package.json' ),
			JSON.stringify( { version: '2.7.4' } )
		);
		fs.writeFileSync(
			path.join( projectRoot, 'content-control.php' ),
			" * Version: 2.7.4\n'version' => '2.7.4',\n"
		);
		fs.writeFileSync(
			path.join( projectRoot, 'readme.txt' ),
			'Stable tag: 2.7.4\n\n= v2.7.4 - 09/20/2026 =\n'
		);
		fs.writeFileSync(
			path.join( projectRoot, 'CHANGELOG.md' ),
			'## v2.7.4 - 09/20/2026\n'
		);
	} );

	afterEach( () => {
		fs.rmSync( projectRoot, { recursive: true, force: true } );
	} );

	test( 'accepts one consistent version newer than the base release', () => {
		expect(
			validateReleaseVersion( {
				projectRoot,
				version: '2.7.4',
				previousVersion: '2.7.3',
			} )
		).toMatchObject( {
			'package.json': '2.7.4',
			'readme.txt stable tag': '2.7.4',
		} );
	} );

	test( 'rejects mismatched release files', () => {
		fs.writeFileSync(
			path.join( projectRoot, 'readme.txt' ),
			'Stable tag: 2.7.3\n\n= v2.7.4 - 09/20/2026 =\n'
		);
		expect( () =>
			validateReleaseVersion( { projectRoot, version: '2.7.4' } )
		).toThrow( 'readme.txt stable tag=2.7.3' );
	} );

	test( 'rejects releases that do not advance the base version', () => {
		expect( () =>
			validateReleaseVersion( {
				projectRoot,
				version: '2.7.4',
				previousVersion: '2.7.4',
			} )
		).toThrow( 'must be newer' );
	} );

	test( 'rejects impossible release dates', () => {
		fs.writeFileSync(
			path.join( projectRoot, 'CHANGELOG.md' ),
			'## v2.7.4 - 99/99/2026\n'
		);
		expect( () =>
			validateReleaseVersion( { projectRoot, version: '2.7.4' } )
		).toThrow( 'no valid dated' );
	} );

	test( 'compares semantic version parts numerically', () => {
		expect( compareVersions( '2.7.4', '2.7.3' ) ).toBeGreaterThan( 0 );
		expect( compareVersions( '3.0.0', '2.99.99' ) ).toBeGreaterThan( 0 );
	} );
} );
