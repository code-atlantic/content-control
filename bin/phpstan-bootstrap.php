<?php
/**
 * PHP Stan bootstrap file.
 *
 * @package ContentControl
 */

if ( ! defined( 'CONTENT_CONTROL_LICENSE_KEY' ) ) {
	/**
	 * License key.
	 *
	 * @phpstan-type string $license_key
	 * @var string $license_key
	 */
	define( 'CONTENT_CONTROL_LICENSE_KEY', '' );
}

if ( ! defined( 'CONTENT_CONTROL_DISABLE_LOGGING' ) ) {
	/**
	 * Disable logging.
	 *
	 * @phpstan-type bool $disable_logging
	 * @var bool $disable_logging
	 */
	define( 'CONTENT_CONTROL_DISABLE_LOGGING', false );
}

if ( ! defined( 'IS_WPCOM' ) ) {
	/**
	 * Is WPCOM.
	 *
	 * @phpstan-type bool $is_wpcom
	 * @var bool $is_wpcom
	 */
	define( 'IS_WPCOM', false );
}

if ( ! defined( 'WP_PLUGIN_DIR' ) ) {
	/**
	 * Plugin directory.
	 *
	 * @var string $wp_plugin_dir
	 */
	define( 'WP_PLUGIN_DIR', '/path/to/wp-content/plugins' );
}

if ( ! defined( 'WP_CONTENT_DIR' ) ) {
	/**
	 * Content directory.
	 *
	 * @var string $wp_content_dir
	 */
	define( 'WP_CONTENT_DIR', '/path/to/wp-content' );
}
