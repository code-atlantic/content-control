<?php
/**
 * Content Control general functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

/**
 * Get a plugin setting
 *
 * @param string $key Option key to get.
 * @param mixed  $default Default value if not found.
 * @return mixed
 */
function get_plugin_option( $key, $default = false ) {
	return Options::get( $key, $default );
}

/**
 * Placeholder for future asset management.
 *
 * @return void
 */
function reset_assets() {
}

/**
 * Placeholder for future asset management.
 *
 * @return bool
 */
function asset_cache_enabled() {
	return false;
}

/**
 * Checks whether function is disabled.
 *
 * @param string $function Name of the function.
 *
 * @return bool Whether or not function is disabled.
 */
function is_func_disabled( $function ) {
	$disabled = explode( ',', ini_get( 'disable_functions' ) );

	return in_array( $function, $disabled, true );
}
