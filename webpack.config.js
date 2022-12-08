const { get } = require( 'lodash' );
const path = require( 'path' );
const CustomTemplatedPathPlugin = require( './packages/custom-templated-path-webpack-plugin' );
const DependencyExtractionWebpackPlugin = require( './packages/dependency-extraction-webpack-plugin' );

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const NODE_ENV = process.env.NODE_ENV || 'development';

const packages = {
	'block-editor': 'packages/block-editor',
	components: 'packages/components',
	'core-data': 'packages/core-data',
	data: 'packages/data',
	fields: 'packages/fields',
	icons: 'packages/icons',
	'rule-engine': 'packages/rule-engine',
	'settings-page': 'packages/settings-page',
	utils: 'packages/utils',
};

const config = {
	...defaultConfig,
	// Maps our buildList into a new object of { key: build.entry }.
	entry: Object.entries( packages ).reduce(
		( entry, [ packageName, packagePath ] ) => {
			entry[ packageName ] = path.resolve(
				process.cwd(),
				packagePath,
				'src'
			);
			return entry;
		},
		{}
	),
	output: {
		filename: ( data ) => {
			const name = data.chunk.name;
			return '[name].js';
		},
		path: path.resolve( process.cwd(), 'dist' ),
		devtoolNamespace: 'content-control/core',
		devtoolModuleFilenameTemplate:
			'webpack://[namespace]/[resource-path]?[loaders]',
		library: {
			// Expose the exports of entry points so we can consume the libraries in window.wc.[modulename] with WooCommerceDependencyExtractionWebpackPlugin.
			name: [ 'contentControl', '[modulename]' ],
			type: 'window',
		},
		// A unique name of the webpack build to avoid multiple webpack runtimes to conflict when using globals.
		uniqueName: '__contentControlAdmin_webpackJsonp',
	},
	resolve: {
		extensions: [ '.json', '.js', '.jsx', '.ts', '.tsx' ],
		alias: {
			...defaultConfig.resolve.alias,
			...Object.entries( packages ).reduce(
				( alias, [ packageName, packagePath ] ) => {
					alias[ `@content-control/${ packageName }` ] = path.resolve(
						__dirname,
						packagePath
					);

					return alias;
				},
				{}
			),
		},
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new CustomTemplatedPathPlugin( {
			modulename( outputPath, data ) {
				const entryName = get( data, [ 'chunk', 'name' ] );
				if ( entryName ) {
					// Convert the dash-case name to a camel case module name.
					// For example, 'csv-export' -> 'csvExport'
					return entryName.replace( /-([a-z])/g, ( match, letter ) =>
						letter.toUpperCase()
					);
				}
				return outputPath;
			},
		} ),
		new DependencyExtractionWebpackPlugin( {
			// injectPolyfill: true,
			// useDefaults: true,
		} ),
	],
	optimization: {
		...defaultConfig.optimization,
		minimize: NODE_ENV !== 'development',
	},
};

module.exports = config;
