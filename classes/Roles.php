<?php


namespace JP\CC;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Roles {
	/**
	 * Returns a list of valid user roles.
	 *
	 * @return array|mixed|void
	 */
	public static function allowed_user_roles() {
		global $wp_roles;

		static $roles;

		if ( ! isset( $roles ) ) {
			$roles = apply_filters( 'jp_cc_user_roles', $wp_roles->role_names );

			if ( ! is_array( $roles ) || empty( $roles ) ) {
				$roles = array();
			}
		}

		return $roles;
	}

}
