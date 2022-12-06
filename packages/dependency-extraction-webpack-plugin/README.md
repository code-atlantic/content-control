# Dependency Extraction Webpack Plugin

Extends Wordpress [Dependency Extraction Webpack Plugin](https://github.com/WordPress/gutenberg/tree/master/packages/dependency-extraction-webpack-plugin) to automatically include Content Control dependencies in addition to WordPress dependencies.

## Installation

Install the module

```
pnpm install @content-control/dependency-extraction-webpack-plugin --save-dev
```

## Usage

Use this as you would [Dependency Extraction Webpack Plugin](https://github.com/WordPress/gutenberg/tree/master/packages/dependency-extraction-webpack-plugin). The API is exactly the same, except that Content Control packages are also handled automatically.

```js
// webpack.config.js
const ContentControlDependencyExtractionWebpackPlugin = require( '@content-control/dependency-extraction-webpack-plugin' );

module.exports = {
	// …snip
	plugins: [ new ContentControlDependencyExtractionWebpackPlugin() ],
};
```

Additional module requests on top of Wordpress [Dependency Extraction Webpack Plugin](https://github.com/WordPress/gutenberg/tree/master/packages/dependency-extraction-webpack-plugin) are:

| Request                        	| Global                   				| Script handle          				| Notes                                                   |
| --------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------------------------- |
| `@content-control/components`     | `contentControl['components']`      	| `content-control-components`        	| |
| `@content-control/core-data`      | `contentControl['coreData']`      	| `content-control-core-data`        	| |
| `@content-control/data`      		| `contentControl['data']`      		| `content-control-data`        		| |
| `@content-control/fields`			| `contentControl['fields']`			| `content-control-fields`   			| |
| `@content-control/rule-engine`	| `contentControl['ruleEngine']`		| `content-control-rule-engine`   		| |
| `@content-control/*`              | `contentControl['*']`                	| `content-control-*`                 	| |

#### Options

An object can be passed to the constructor to customize the behavior, for example:

```js
module.exports = {
	plugins: [
		new ContentControlDependencyExtractionWebpackPlugin( {
			bundledPackages: [ '@content-control/components' ],
		} ),
	],
};
```

##### `bundledPackages`

-   Type: array
-   Default: []

A list of potential Content Control excluded packages, this will include the excluded package within the bundle (example above).

For more supported options see the original [dependency extraction plugin](https://github.com/WordPress/gutenberg/blob/trunk/packages/dependency-extraction-webpack-plugin/README.md#options).
