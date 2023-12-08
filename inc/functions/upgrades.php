<?php
/**
 * Backward compatibility functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use function wp_parse_args;
use function apply_filters;

/**
 * Get the current data versions.
 *
 * @return int[]
 */
function current_data_versions() {
	return apply_filters( 'content_control/current_data_versions', [
		'backup'       => 2,
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
	$versioning = \get_option( 'content_control_data_versioning', [] );

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
 * @param int[] $versioning Data versions.
 *
 * @return bool
 */
function set_data_versions( $versioning ) {
	$versioning = wp_parse_args( $versioning, get_data_versions() );

	return \update_option( 'content_control_data_versioning', $versioning );
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

	switch ( $key ) {
		// Fallthrough.
		case 'restrictions':
			// If set to v1 and there are no v1 restrictions, set to v2.
			if ( 1 === $versioning[ $key ] ) {
				$v1_restrictions = get_v1_restrictions();

				if ( false === $v1_restrictions ) {
					$versioning[ $key ] = 2;
					set_data_versions( $versioning );
					return 2;
				}
			}

			break;

		case 'settings':
			// If set to v1 and there are no v1 settings, set to v2.
			if ( 1 === $versioning[ $key ] ) {
				$v1_settings = \get_option( 'jp_cc_settings', [] );

				if ( empty( $v1_settings ) ) {
					$versioning[ $key ]   = 2;
					$versioning['backup'] = 2; // Backup is always the same as settings.
					set_data_versions( $versioning );
					return 2;
				}
			}

			break;
	}

	return isset( $versioning[ $key ] ) ? $versioning[ $key ] : false;
}

/**
 * Checks if user is upgrading from < 2.0.0.
 *
 * Sets data versioning to 1 as they didn't exist before.
 *
 * @param string $old_version Old version.
 *
 * @return void
 */
function maybe_force_v2_migrations( $old_version ) {
	if ( version_compare( $old_version, '2.0.0', '<' ) ) {
		$versioning = get_data_versions();

		// Forces updates for all data types to v2.
		$versioning = wp_parse_args( [
			'backup'       => 1,
			'settings'     => 1,
			'restrictions' => 1,
			'plugin_meta'  => 1,
			'user_meta'    => 1,
		], $versioning );

		\update_option( 'content_control_data_versioning', $versioning );
	}
}

/**
 * Get the name of an upgrade.
 *
 * @param string|\ContentControl\Base\Upgrade $upgrade Upgrade to get name for.
 *
 * @return string
 */
function get_upgrade_name( $upgrade ) {
	if ( is_object( $upgrade ) ) {
		$upgrade = $upgrade::TYPE . '-' . $upgrade::VERSION;
	}

	return $upgrade;
}

/**
 * Get the completed upgrades.
 *
 * @return string[]
 */
function get_completed_upgrades() {
	return \get_option( 'content_control_completed_upgrades', [] );
}

/**
 * Set the completed upgrades.
 *
 * @param string[] $upgrades Completed upgrades.
 *
 * @return bool
 */
function set_completed_upgrades( $upgrades ) {
	return \update_option( 'content_control_completed_upgrades', $upgrades );
}

/**
 * Mark an upgrade as complete.
 *
 * @param \ContentControl\Base\Upgrade $upgrade Upgrade to mark as complete.
 *
 * @return void
 */
function mark_upgrade_complete( $upgrade ) {
	$upgrade_name = get_upgrade_name( $upgrade );

	$upgrades = get_completed_upgrades();

	if ( ! in_array( $upgrade_name, $upgrades, true ) ) {
		$upgrades[] = $upgrade_name;
	}

	set_completed_upgrades( $upgrades );

	// Update the data version.
	set_data_version( $upgrade::TYPE, $upgrade::VERSION );

	/**
	 * Fires when an upgrade is marked as complete.
	 *
	 * @param \ContentControl\Base\Upgrade $upgrade Upgrade type.
	 */
	do_action( 'content_control/upgrade_complete', $upgrade );

	/**
	 * Fires when a specific upgrade is marked as complete.
	 *
	 * @param \ContentControl\Base\Upgrade $upgrade Upgrade type.
	 */
	do_action( "content_control/upgrade_complete/{$upgrade_name}", $upgrade );
}

/**
 * Check if an upgrade has been completed.
 *
 * @param string|\ContentControl\Base\Upgrade $upgrade Upgrade to check.
 *
 * @return bool
 */
function is_upgrade_complete( $upgrade ) {
	$upgrade = get_upgrade_name( $upgrade );

	$upgrades = get_completed_upgrades();

	return in_array( $upgrade, $upgrades, true );
}
