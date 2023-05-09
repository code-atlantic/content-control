<?php
/**
 * Restriction utility & helper functions.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

/**
 * Check if user meets requirements.
 *
 * @param string       $status logged_in or logged_out.
 * @param array|string $roles array of roles to check.
 * @return bool True if user meets requirements, false if not.
 */
function user_meets_requirements( $status, $roles = [] ) {
	if ( empty( $status ) ) {
		// Always default to protecting content.
		return false;
	}

	// If roles is string, convert to array.
	if ( is_string( $roles ) ) {
		$roles = strpos( $roles, ',' ) !== false ? array_map(
			'trim',
			explode( ',', $roles )
		) : [ $roles ];
	}

	// If roles is array of keyed roles, convert to array of roles[].
	if ( is_string( key( $roles ) ) ) {
		$roles = array_keys( $roles );
	}

	$logged_in = is_user_logged_in();

	switch ( $status ) {
		case 'logged_in':
			// If not logged in, return false.
			if ( ! $logged_in ) {
				return false;
			}

			// If we got this far, we're logged in.
			if ( empty( $roles ) ) {
				return true;
			}

			// Checks all roles, any match will return true.
			foreach ( $roles as $role ) {
				if ( current_user_can( $role ) ) {
					return true;
				}
			}

			// If we got this far, we're logged in but don't have the required role.
			return false;

		case 'logged_out':
			return ! $logged_in;

		default:
			return false;
	}

	return false;
}
