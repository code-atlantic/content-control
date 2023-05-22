<?php
/**
 * Rule callback functions.
 *
 * @package ContentControl
 */

namespace ContentControl\Rules;

/**
 * Gets a filterable array of the allowed user roles.
 *
 * @return array|mixed
 */
function allowed_user_roles() {
	static $roles;

	if ( ! isset( $roles ) ) {
		/**
		 * Filter the allowed user roles.
		 *
		 * @param array $roles
		 *
		 * @return array
		 */
		$roles = apply_filters( 'content_control_user_roles', wp_roles()->get_names() );

		if ( ! is_array( $roles ) || empty( $roles ) ) {
			$roles = [];
		}
	}

	return $roles;
}

/**
 * Checks if a user has one of the selected roles.
 *
 * @param array $condition
 *
 * @return bool
 */
function user_has_role( $condition = [] ) {
	if ( ! is_user_logged_in() ) {
		return false;
	} elseif ( empty( $condition['settings']['selected'] ) ) {
		return true;
	}

	$selected = $condition['settings']['selected'];

	// Get Enabled Roles to check for.
	$user_roles     = array_keys( allowed_user_roles() );
	$required_roles = array_intersect( $user_roles, $selected );

	if ( empty( $required_roles ) ) {
		return true;
	}

	$check = false;
	foreach ( $required_roles as $role ) {
		if ( current_user_can( $role ) ) {
			$check = true;
			break;
		}
	}

	return $check;
}
