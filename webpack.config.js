const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

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
			'@components': path.resolve( __dirname, 'src/components' ),
			'@data': path.resolve( __dirname, 'src/data' ),
			'@icons': path.resolve( __dirname, 'src/icons' ),
		},
	},
};

module.exports = config;
