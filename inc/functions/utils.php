<?php
/**
 * Utility functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if an addon is installed.
 *
 * @param string $plugin_basename Plugin slug.
 *
 * @return bool
 */
function is_plugin_installed( $plugin_basename ) {
	static $installed_plugins = null;

	if ( null === $installed_plugins ) {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$installed_plugins = \get_plugins();
	}

	return isset( $installed_plugins[ $plugin_basename ] );
}
