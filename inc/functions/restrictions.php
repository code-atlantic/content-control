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
 * @param string       $user_status logged_in or logged_out.
 * @param array|string $user_roles array of roles to check.
 * @param string       $role_match any|match|exclude.
 *
 * @return bool True if user meets requirements, false if not.
 */
function user_meets_requirements( $user_status, $user_roles = [], $role_match = 'match' ) {
	if ( empty( $user_status ) ) {
		// Always default to protecting content.
		return false;
	}

	// If roles is string, convert to array.
	if ( is_string( $user_roles ) ) {
		$user_roles = explode( ',', $user_roles );
		$user_roles = array_map( 'trim', $user_roles );
		$user_roles = array_map( 'strtolower', $user_roles );
	}

	// If roles is array of keyed roles, convert to array of roles[].
	if ( is_string( key( $user_roles ) ) ) {
		$user_roles = array_keys( $user_roles );
	}

	$logged_in = is_user_logged_in();

	switch ( $user_status ) {
		case 'logged_in':
			// If not logged in, return false.
			if ( ! $logged_in ) {
				return false;
			}

			// If we got this far, we're logged in.
			if ( 'any' === $role_match || empty( $user_roles ) ) {
				return true;
			}

			// true for match, false for exclude.
			$match_value = 'match' === $role_match ? true : false;

			// Checks all roles, any match will return.
			foreach ( $user_roles as $role ) {
				if ( current_user_can( $role ) ) {
					return $match_value;
				}
			}

			// If we got this far, we're logged in but don't have the required role.
			return ! $match_value;

		case 'logged_out':
			return ! $logged_in;

		default:
			return false;
	}

	return false;
}
