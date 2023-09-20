<?php
/**
 * PHP Stan bootstrap file.
 *
 * @package ContentControl
 */

if ( ! defined( 'CONTENT_CONTROL_LICENSE_KEY' ) ) {
	define( 'CONTENT_CONTROL_LICENSE_KEY', 'some+key' );
}

if ( ! defined( 'CONTENT_CONTROL_DISABLE_LOGGING' ) ) {
	define( 'CONTENT_CONTROL_DISABLE_LOGGING', true );
}

if ( ! defined( 'IS_WPCOM' ) ) {
	define( 'IS_WPCOM', true );
}

if ( ! defined( 'WP_PLUGIN_DIR' ) ) {
	define( 'WP_PLUGIN_DIR', '/path/to/wp-content/plugins' );
}

if ( ! defined( 'WP_CONTENT_DIR' ) ) {
	define( 'WP_CONTENT_DIR', '/path/to/wp-content' );
}
