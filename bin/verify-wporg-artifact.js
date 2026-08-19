#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require( 'fs' );
const path = require( 'path' );
const { execFileSync } = require( 'child_process' );

const pluginSlug = 'content-control';

const forbiddenPaths = [
	'classes/Plugin/Connect.php',
	'classes/Plugin/Upgrader.php',
	'classes/Installers/Install_Skin.php',
	'classes/Installers/PluginSilentUpgrader.php',
	'classes/Installers/PluginSilentUpgraderSkin.php',
];

const requiredPaths = [
	'classes/Plugin/License.php',
	'classes/RestAPI/License.php',
];

const forbiddenReleasePathPrefixes = [
	'.github/',
	'.git/',
	'bin/',
	'docs/',
	'node_modules/',
	'packages/',
	'tests/',
];

const forbiddenReleaseRootFiles = new Set( [
	'composer.json',
	'composer.lock',
	'package.json',
	'package-lock.json',
	'phpstan.neon.dist',
	'phpunit-watcher.yml.dist',
	'psalm.xml',
	'tsconfig.base.json',
	'tsconfig.json',
	'webpack.config.js',
] );

const sourceRoots = [
	'assets',
	'bin',
	'classes',
	'dist',
	'inc',
	'languages',
	'packages',
	'vendor-prefixed',
];

const textEntryPattern =
	/\.(?:php\d*|phtml|phtm|pht|inc|js|jsx|mjs|cjs|map|json|txt|html|css|scss|ts|tsx|svg|xml|po|pot)$/i;

const forbiddenPatterns = [
	[
		'removed Connect service',
		/ContentControl\\{1,2}Plugin\\{1,2}Connect|class\s+Connect\b/i,
	],
	[
		'removed Core upgrader service',
		/ContentControl\\{1,2}Plugin\\{1,2}Upgrader|class\s+Upgrader\b/i,
	],
	[ 'silent installer class', /PluginSilentUpgrader/i ],
	[
		'package-delivery AJAX handler',
		/content_control_connect|process_verify_connection|process_webhook/i,
	],
	[ 'connection response metadata', /\bconnectInfo\b/i ],
	[
		'installation metadata endpoint',
		/license\/(?:activate-pro|connect-info)|['"`]activate-pro['"`]/i,
	],
	[
		'installer-specific UI',
		/content-control-license-connect|\bactivatePro\b|\binstallPro\b/i,
	],
	[
		'public package response field',
		/['"`](?:package|package_url|download_url)['"`]\s*(?:=>|:)/i,
	],
];

const allowlists = {
	complianceTooling: new Set( [ 'bin/verify-wporg-artifact.js' ] ),
	pluginLifecycle: new Set( [
		'content-control.php',
		'bin/stubs/content-control.php',
		'classes/Plugin/Install.php',
	] ),
};

const capabilityRules = [
	{
		label: 'plugin package upgrader capability',
		pattern:
			/\b(?:Plugin_Upgrader|WP_Upgrader)\b|\b(?:download_url|unzip_file|install_plugin)\s*\(/i,
		allowedPaths: new Set(),
	},
	{
		label: 'plugin activation capability',
		pattern: /\b(?:activate_plugin|deactivate_plugins)\s*\(/i,
		allowedPaths: allowlists.pluginLifecycle,
	},
	{
		label: 'plugin delivery handler',
		pattern:
			/(?:function\s+|(?:->|::))(?:(?:[a-z0-9_]+_)?(?:install|download|deploy|sideload|activate)_(?:plugin|package|archive)(?:_[a-z0-9_]+)?|(?:[a-z0-9_]+_)?(?:plugin|package|archive)_(?:install|download|deploy|sideload|activate)(?:_[a-z0-9_]+)?|[a-z0-9]*(?:install|download|deploy|sideload|activate)(?:plugin|package|archive)[a-z0-9]*|[a-z0-9]*(?:plugin|package|archive)(?:install|download|deploy|sideload|activate)[a-z0-9]*)\s*\(/i,
		allowedPaths: allowlists.pluginLifecycle,
	},
	{
		label: 'plugin package execution',
		patterns: [
			/(?:->|::)(?:install|upgrade|download|unpack|run)\s*\(/i,
			/(?:\$(?:package|plugin|archive|zip)\b|->package\b|['"]package['"]\s*=>|\b(?:Plugin_Upgrader|WP_Upgrader)\b|class-plugin-upgrader\.php)/i,
		],
		allowedPaths: new Set(),
	},
	{
		label: 'plugin delivery REST route',
		pattern:
			/(?:^|[^a-z_])register_rest_route\s*\([\s\S]{0,600}['"`][^'"`]*(?:connect|install|download|upgrade|deploy|sideload)[^'"`]*['"`]/i,
		allowedPaths: new Set(),
	},
	{
		label: 'remote plugin package response',
		patterns: [
			/\bwp_(?:safe_)?remote_(?:get|post|request)\s*\(/i,
			/(?:\bWP_PLUGIN_DIR\b|wp-content\/plugins|class-plugin-upgrader\.php|['"]package['"]\s*=>|->package\b)/i,
		],
		allowedPaths: new Set(),
	},
	{
		label: 'remote plugin delivery request',
		pattern:
			/\b(?:apiFetch|fetch|ajax\.post)\s*\([\s\S]{0,500}(?:activate-pro|activate-plugin|connect|install|download|upgrade|deploy|sideload)/i,
		allowedPaths: new Set(),
	},
];

function relativeArtifactPath( entry ) {
	const normalized = entry
		.replace( /\\/g, '/' )
		.replace( /^(?:\.\/|\/)+/, '' );
	const artifactRoot = `${ pluginSlug }/`;

	return normalized.startsWith( artifactRoot )
		? normalized.slice( artifactRoot.length )
		: normalized;
}

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
			pluginSlug !== pathWithoutTrailingSlash &&
			! normalized.startsWith( `${ pluginSlug }/` )
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

function isAllowedRuntimeVendorPath( relativePath ) {
	return (
		'vendor/' === relativePath ||
		'vendor/composer/' === relativePath ||
		'vendor/autoload.php' === relativePath ||
		/^vendor\/composer\/[^/]+\.(?:php|json)$/i.test( relativePath )
	);
}

function verifyReleaseManifest( entries ) {
	const failures = [];

	for ( const entry of entries ) {
		const relativePath = relativeArtifactPath( entry );
		const parts = relativePath.split( '/' );
		const isForbiddenPrefix = forbiddenReleasePathPrefixes.some(
			( prefix ) => relativePath.startsWith( prefix )
		);
		const isForbiddenVendor =
			relativePath.startsWith( 'vendor/' ) &&
			! isAllowedRuntimeVendorPath( relativePath );
		const isRootMarkdown = /^[^/]+\.md$/i.test( relativePath );
		const isRepositoryMetadata = parts.some(
			( part ) => '.DS_Store' === part || '.git' === part
		);
		const isRootDotfile = /^[.][^/]+/.test( relativePath );

		if (
			isForbiddenPrefix ||
			isForbiddenVendor ||
			isRootMarkdown ||
			isRepositoryMetadata ||
			isRootDotfile ||
			forbiddenReleaseRootFiles.has( relativePath )
		) {
			failures.push( `forbidden release path: ${ relativePath }` );
		}
	}

	return [ ...new Set( failures ) ];
}

function scanCapabilities( entry, contents ) {
	const relativePath = relativeArtifactPath( entry );
	const failures = [];

	for ( const rule of capabilityRules ) {
		if ( rule.allowedPaths.has( relativePath ) ) {
			continue;
		}

		const matched = rule.patterns
			? rule.patterns.every( ( pattern ) => pattern.test( contents ) )
			: rule.pattern.test( contents );

		if ( matched ) {
			failures.push( `${ rule.label } in ${ entry }` );
		}
	}

	return failures;
}

function verifyArtifactEntries( entries, readEntry ) {
	const failures = [];
	const relativePaths = new Set( entries.map( relativeArtifactPath ) );

	for ( const forbiddenPath of forbiddenPaths ) {
		if ( relativePaths.has( forbiddenPath ) ) {
			failures.push( `forbidden path: ${ forbiddenPath }` );
		}
	}

	for ( const relativePath of relativePaths ) {
		if ( /\.phar$/i.test( relativePath ) ) {
			failures.push( `forbidden executable archive: ${ relativePath }` );
		}
	}

	for ( const requiredPath of requiredPaths ) {
		if ( ! relativePaths.has( requiredPath ) ) {
			failures.push( `missing compatibility path: ${ requiredPath }` );
		}
	}

	for ( const entry of entries.filter(
		( archiveEntry ) => ! archiveEntry.endsWith( '/' )
	) ) {
		if (
			allowlists.complianceTooling.has( relativeArtifactPath( entry ) )
		) {
			continue;
		}

		const entryContents = readEntry( entry );
		const buffer = Buffer.isBuffer( entryContents )
			? entryContents
			: Buffer.from( entryContents );
		const isKnownText = textEntryPattern.test( entry );
		const containsPhp = /<\?(?:php|=)/i.test( buffer.toString( 'latin1' ) );

		if ( ! isKnownText && ! containsPhp ) {
			continue;
		}

		const contents = buffer.toString();

		for ( const [ label, pattern ] of forbiddenPatterns ) {
			if ( pattern.test( contents ) ) {
				failures.push( `${ label } in ${ entry }` );
			}
		}

		failures.push( ...scanCapabilities( entry, contents ) );
	}

	return [ ...new Set( failures ) ];
}

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

function verifyZipEntryTypes( zipPath, entries ) {
	const listing = execFileSync( 'unzip', [ '-Z', '-l', zipPath ], {
		encoding: 'utf8',
	} );
	const entryTypes = listing
		.split( '\n' )
		.filter( ( line ) => /^[bcdlps-].{9}\s/.test( line ) )
		.map( ( line ) => line.charAt( 0 ) );

	return verifyArchiveEntryTypes( entries, entryTypes );
}

function verifyZip( zipPath ) {
	if ( ! fs.existsSync( zipPath ) ) {
		throw new Error( `Artifact not found: ${ zipPath }` );
	}

	const entries = execFileSync( 'unzip', [ '-Z1', zipPath ], {
		encoding: 'utf8',
	} )
		.split( '\n' )
		.filter( Boolean );
	const failures = [
		...verifyArchiveStructure( entries ),
		...verifyZipEntryTypes( zipPath, entries ),
		...verifyReleaseManifest( entries ),
		...verifyArtifactEntries( entries, ( entry ) =>
			execFileSync( 'unzip', [ '-p', zipPath, entry ], {
				maxBuffer: 20 * 1024 * 1024,
			} )
		),
	];

	return { entries, failures: [ ...new Set( failures ) ] };
}

function walkTree( root, directory, skippedDirectories = new Set() ) {
	const entries = [];

	for ( const directoryEntry of fs.readdirSync( directory, {
		withFileTypes: true,
	} ) ) {
		const entryPath = path.join( directory, directoryEntry.name );
		const relativePath = path
			.relative( root, entryPath )
			.replace( /\\/g, '/' );

		if (
			skippedDirectories.has( directoryEntry.name ) &&
			( directoryEntry.isDirectory() || directoryEntry.isSymbolicLink() )
		) {
			continue;
		}

		if ( directoryEntry.isDirectory() ) {
			entries.push( ...walkTree( root, entryPath, skippedDirectories ) );
		} else if (
			directoryEntry.isFile() ||
			directoryEntry.isSymbolicLink()
		) {
			entries.push( relativePath );
		}
	}

	return entries;
}

function collectSourceEntries( projectRoot ) {
	const entries = [];
	const skippedDirectories = new Set( [
		'.git',
		'coverage',
		'node_modules',
		'vendor',
	] );

	for ( const sourceRoot of sourceRoots ) {
		const sourcePath = path.join( projectRoot, sourceRoot );

		if ( fs.existsSync( sourcePath ) ) {
			entries.push(
				...walkTree( projectRoot, sourcePath, skippedDirectories )
			);
		}
	}

	for ( const rootEntry of fs.readdirSync( projectRoot, {
		withFileTypes: true,
	} ) ) {
		if (
			( rootEntry.isFile() || rootEntry.isSymbolicLink() ) &&
			! rootEntry.name.startsWith( '.' ) &&
			/^[^/]+\.php\d*$/i.test( rootEntry.name )
		) {
			entries.push( rootEntry.name );
		}
	}

	return [ ...new Set( entries ) ].sort();
}

function verifyTreeEntries( root, entries, includeManifest = false ) {
	const symlinkEntries = entries.filter( ( entry ) =>
		fs.lstatSync( path.join( root, entry ) ).isSymbolicLink()
	);
	const regularEntries = entries.filter(
		( entry ) => ! symlinkEntries.includes( entry )
	);
	const failures = [
		...symlinkEntries.map( ( entry ) => `source symlink: ${ entry }` ),
		...( includeManifest ? verifyReleaseManifest( regularEntries ) : [] ),
		...verifyArtifactEntries( regularEntries, ( entry ) =>
			fs.readFileSync( path.join( root, entry ) )
		),
	];

	return { entries, failures: [ ...new Set( failures ) ] };
}

function verifySourceTree( projectRoot ) {
	return verifyTreeEntries(
		projectRoot,
		collectSourceEntries( projectRoot )
	);
}

function verifyReleaseTree( releaseRoot ) {
	return verifyTreeEntries(
		releaseRoot,
		walkTree( releaseRoot, releaseRoot ),
		true
	);
}

function main() {
	const mode = process.argv[ 2 ];
	const sourceMode = '--source' === mode;
	const treeMode = '--release-tree' === mode;
	const targetPath = path.resolve(
		sourceMode || treeMode
			? process.argv[ 3 ] || process.cwd()
			: mode || path.join( process.cwd(), `${ pluginSlug }-latest.zip` )
	);
	let result;
	let targetLabel;

	if ( sourceMode ) {
		result = verifySourceTree( targetPath );
		targetLabel = 'source';
	} else if ( treeMode ) {
		result = verifyReleaseTree( targetPath );
		targetLabel = 'release tree';
	} else {
		result = verifyZip( targetPath );
		targetLabel = 'artifact';
	}

	const { entries, failures } = result;

	if ( failures.length ) {
		console.error( `WordPress.org ${ targetLabel } verification failed:` );
		for ( const failure of failures ) {
			console.error( `- ${ failure }` );
		}
		process.exitCode = 1;
		return;
	}

	console.log(
		`WordPress.org ${ targetLabel } verification passed (${ entries.length } files checked).`
	);
}

if ( require.main === module ) {
	main();
}

module.exports = {
	collectSourceEntries,
	relativeArtifactPath,
	scanCapabilities,
	verifyArchiveEntryTypes,
	verifyArchiveStructure,
	verifyArtifactEntries,
	verifyReleaseManifest,
	verifyReleaseTree,
	verifySourceTree,
	verifyZip,
	verifyZipEntryTypes,
};

/* eslint-enable no-console */
