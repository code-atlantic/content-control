const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

const config = {
	...defaultConfig,
	// Maps our buildList into a new object of { key: build.entry }.
	entry: {
		'block-editor': path.resolve( process.cwd(), 'src', 'block-editor' ),
		'settings-page': path.resolve( process.cwd(), 'src', 'settings-page' ),
		'widget-editor': path.resolve( process.cwd(), 'src', 'widget-editor' ),
	},
	output: {
		...defaultConfig.output,
		devtoolNamespace: 'content-control/core',
		devtoolModuleFilenameTemplate:
			'webpack://[namespace]/[resource-path]?[loaders]',
		path: path.resolve( process.cwd(), 'dist' ),
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			// add as many aliases as you like!
			'@content-control/components': path.resolve(
				__dirname,
				'packages/components'
			),
			'@content-control/core-data': path.resolve(
				__dirname,
				'packages/core-data'
			),
			'@content-control/data': path.resolve( __dirname, 'packages/data' ),
			'@icons': path.resolve( __dirname, 'src/icons' ),
			'@utils': path.resolve( __dirname, 'src/utils' ),
		},
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin( {
			injectPolyfill: true,
			useDefaults: true,
			requestToExternal( request ) {
				const externalMap = {
					'@content-control/components': [
						'contentControl',
						'components',
					],
					'@content-control/core-data': [
						'contentControl',
						'coreData',
					],
					'@content-control/data': [ 'contentControl', 'data' ],
				};

				if ( typeof externalMap[ request ] !== 'undefined' ) {
					return externalMap[ request ];
				}
			},
			requestToHandle( request ) {
				const handleMap = {
					'@content-control/components': 'content-control-components',
					'@content-control/core-data': 'content-control-core-data',
					'@content-control/data': 'content-control-data',
				};

				if ( typeof handleMap[ request ] !== 'undefined' ) {
					return handleMap[ request ];
				}
			},
		} ),
	],
};

module.exports = config;
