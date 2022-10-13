const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

const packages = [
	{
		name: 'block-editor',
		path: 'packages/block-editor',
		exportAs: 'blockEditor',
	},
	{
		name: 'components',
		path: 'packages/components',
		exportAs: 'components',
	},
	{
		name: 'core-data',
		path: 'packages/core-data',
		exportAs: 'coreData',
	},

	{
		name: 'core-data',
		path: 'packages/core-data',
		exportAs: 'coreData',
	},
	{
		name: 'data',
		path: 'packages/data',
		exportAs: 'data',
	},
	{
		name: 'fields',
		path: 'packages/fields',
		exportAs: 'fields',
	},
	{
		name: 'icons',
		path: 'packages/icons',
		exportAs: false,
	},
	{
		name: 'rule-engine',
		path: 'packages/rule-engine',
		exportAs: 'ruleEngine',
	},
	{
		name: 'settings-page',
		path: 'packages/settings-page',
		exportAs: 'settingsPage',
	},
	{
		name: 'utils',
		path: 'packages/utils',
		exportAs: false,
	},
];

const config = {
	...defaultConfig,
	// Maps our buildList into a new object of { key: build.entry }.
	entry: packages.reduce( ( entry, p ) => {
		if ( p.exportAs ) {
			entry[ p.name ] = path.resolve( process.cwd(), p.path, 'src' );
		}

		return entry;
	}, {} ),
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
			...packages.reduce( ( alias, p ) => {
				alias[ `@content-control/${ p.name }` ] = path.resolve(
					__dirname,
					p.path
				);

				return alias;
			}, {} ),
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
				const externalMap = packages.reduce( ( map, p ) => {
					if ( p.exportAs ) {
						map[ `@content-control/${ p.name }` ] = [
							'contentControl',
							p.exportAs,
						];
					}

					return map;
				}, {} );

				if ( typeof externalMap[ request ] !== 'undefined' ) {
					return externalMap[ request ];
				}
			},
			requestToHandle( request ) {
				const handleMap = packages.reduce( ( map, p ) => {
					if ( p.exportAs ) {
						map[
							`@content-control/${ p.name }`
						] = `content-control-${ p.name }`;
					}

					return map;
				}, {} );

				if ( typeof handleMap[ request ] !== 'undefined' ) {
					return handleMap[ request ];
				}
			},
		} ),
	],
};

module.exports = config;
