<?php
/**
 * Backward compatibility functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

use function get_option;
use function update_option;
use function wp_parse_args;
use function apply_filters;

/**
 * Get the current data versions.
 *
 * @return int[]
 */
function current_data_versions() {
	return apply_filters( 'content_control/current_data_versions', [
		'settings'     => 2,
		'restrictions' => 2,
		'plugin_meta'  => 2,
		'user_meta'    => 2,
	] );
}

/**
 * Get all data versions.
 *
 * @return int[]
 */
function get_data_versions() {
	$versioning = get_option( 'content_control_data_versioning', [] );

	return wp_parse_args( $versioning, current_data_versions() );
}

/**
 * Set the data version.
 *
 * @param string $key    Data key.
 * @param int    $version Data version.
 *
 * @return bool
 */
function set_data_version( $key, $version ) {
	$versioning = get_data_versions();

	$versioning[ $key ] = $version;

	return set_data_versions( $versioning );
}

/**
 * Set the data version.
 *
 * @param int $versioning Data versions.
 *
 * @return bool
 */
function set_data_versions( $versioning ) {
	$versioning = wp_parse_args( $versioning, get_data_versions() );

	return update_option( 'content_control_data_versioning', $versioning );
}

/**
 * Get the current data version.
 *
 * @param string $key Type of data to get version for.
 *
 * @return int|bool
 */
function get_data_version( $key ) {
	$versioning = get_data_versions();

	return isset( $versioning[ $key ] ) ? $versioning[ $key ] : false;
}

add_action( 'content_control/update_version', __NAMESPACE__ . '\maybe_force_v2_migrations' );

/**
 * Checks if user is upgrading from < 2.0.0.
 *
 * Sets data versioning to 1 as they didn't exist before.
 *
 * @param string $old_version Old version.
 */
function maybe_force_v2_migrations( $old_version ) {
	if ( version_compare( $old_version, '2.0.0', '<' ) ) {
		$versioning = get_data_versions();

		// Forces updates for all data types to v2.
		$versioning = wp_parse_args( [
			'settings'     => 1,
			'restrictions' => 1,
			'plugin_meta'  => 1,
			'user_meta'    => 1,
		], $versioning );

		update_option( 'content_control_data_versioning', $versioning );
	}
}
