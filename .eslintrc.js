const eslintConfig = {
	root: true,
	extends: [ 'plugin:@code-atlantic/eslint-plugin/recommended' ],
	globals: {
		wp: 'readonly',
		contentControlBlockEditorVars: 'readonly',
		contentControlSettingsPageVars: 'readonly',
		window: 'readonly',
	},
	env: {
		browser: true,
		jquery: true,
	},
	settings: {
		jsdoc: {
			mode: 'typescript',
		},
		'import/resolver': {
			webpack: {
				config: 'webpack.config.js',
			},
			node: {
				moduleDirectory: [ 'node_modules', 'src' ],
			},
		},
	},
	parserOptions: {
		requireConfigFile: false,
		babelOptions: {
			presets: [ require.resolve( '@wordpress/babel-preset-default' ) ],
		},
	},
	rules: {},
};

module.exports = eslintConfig;
