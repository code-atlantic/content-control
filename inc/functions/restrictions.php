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

use function ContentControl\plugin;

/**
 * Get restriction, by ID, slug or object.
 *
 * @param int|string|\ContentControl\Models\Restriction $restriction Restriction ID, slug or object.
 *
 * @return \ContentControl\Models\Restriction|null
 */
function get_restriction( $restriction ) {
	return plugin( 'restrictions' )->get_restriction( $restriction );
}

/**
 * Check if admins are excluded from restrictions.
 *
 * @return bool True if admins are excluded, false if not.
 */
function admins_are_excluded() {
	return get_data_version( 'settings' ) > 1 && plugin()->get_option( 'excludeAdmins' );
}

/**
 * Current user is excluded from restrictions.
 *
 * @return bool True if user is excluded, false if not.
 */
function user_is_excluded() {
	return admins_are_excluded() && \current_user_can( plugin()->get_permission( 'manage_settings' ) );
}

/**
 * Check if user meets requirements.
 *
 * @param string                               $user_status logged_in or logged_out.
 * @param string[]|array<string,string>|string $user_roles array of roles to check.
 * @param string                               $role_match any|match|exclude.
 *
 * @return bool True if user meets requirements, false if not.
 */
function user_meets_requirements( $user_status, $user_roles = [], $role_match = 'match' ) {
	if ( empty( $user_status ) ) {
		// Always default to protecting content.
		return false;
	}

	if ( ! in_array( $user_status, [ 'logged_in', 'logged_out' ], true ) ) {
		// Invalid user status.
		return false;
	}

	if ( ! is_array( $user_roles ) ) {
		// If roles is string, convert to array.
		$user_roles = explode( ',', $user_roles );
		$user_roles = array_map( 'trim', $user_roles );
		$user_roles = array_map( 'strtolower', $user_roles );
	}

	// If roles is array of keyed roles, convert to array of roles[].
	if ( is_string( key( $user_roles ) ) ) {
		$user_roles = array_keys( $user_roles );
	}

	$logged_in = \is_user_logged_in();

	switch ( $user_status ) {
		case 'logged_in':
			// If not logged in, return false.
			if ( ! $logged_in ) {
				return false;
			}

			// If current user is excluded from restrictions, return true.
			if ( user_is_excluded() ) {
				return true;
			}

			// If we got this far, we're logged in.
			if ( 'any' === $role_match || empty( $user_roles ) ) {
				return true;
			}

			if ( ! in_array( $role_match, [ 'match', 'exclude' ], true ) ) {
				// Invalid role match.
				return false;
			}

			// True for match, false for exclude.
			$match_value = 'match' === $role_match ? true : false;

			// Checks all roles, any match will return.
			foreach ( $user_roles as $role ) {
				if ( \current_user_can( $role ) ) {
					return $match_value;
				}
			}

			// If we got this far, we're logged in but don't have the required role.
			return ! $match_value;

		case 'logged_out':
			return ! $logged_in;
	}
}

/**
 * Check if a given query can be ignored.
 *
 * @param \WP_Query $query Query object.
 *
 * @return bool True if query can be ignored, false if not.
 */
function query_can_be_ignored( $query = null ) {
	if ( $query->get( 'ignore_restrictions', false ) ) {
		return true;
	}

	$post_types_to_ignore = \apply_filters( 'content_control/post_types_to_ignore', [
		'cc_restriction',
		'wp_template',
		'wp_template_part',
		'wp_global_styles',
		'oembed_cache',
	] );

	// Ignore specific core post types.
	if ( in_array( $query->get( 'post_type' ), $post_types_to_ignore, true ) ) {
		return true;
	}

	return false !== \apply_filters( 'content_control/ignoreable_query', false, $query );
}
