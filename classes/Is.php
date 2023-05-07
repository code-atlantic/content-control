<?php
/**
 * Conditional helper utilities.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

/**
 * Class Is
 *
 * @package ContentControl
 */
class Is {

	/**
	 * Check if a content is accessible to current user.
	 *
	 * @param string $who logged_in or logged_out.
	 * @param array  $roles array of roles to check.
	 * @param array  $args context and other args to pass to the filters, generic for now so it could be extended later.
	 *
	 * @return bool
	 */
	public static function accessible( $who = '', $roles = [], $args = [] ) {
		if ( is_string( $args ) ) {
			$args = [ 'context' => $args ];
		}

		if ( ! is_array( $roles ) ) {
			$roles = [];
		}

		$args = wp_parse_args( $args, [
			'context' => '',
		] );

		if ( is_string( key( $roles ) ) ) {
			$roles = array_keys( $roles );
		}

		$logged_in = is_user_logged_in();

		$exclude = false;

		switch ( $who ) {
			case 'logged_in':
				if ( ! $logged_in ) {
					$exclude = true;
				} elseif ( ! empty( $roles ) ) {

					// Checks all roles, should not exclude if any are active.
					$valid_role = false;

					foreach ( $roles as $role ) {
						if ( current_user_can( $role ) ) {
							$valid_role = true;
							break;
						}
					}

					if ( ! $valid_role ) {
						$exclude = true;
					}
				}
				break;

			case 'logged_out':
				$exclude = $logged_in;
				break;

			default:
				// Do nothing if the who value does not match logged_in or logged_out.
		}

		$exclude = apply_filters( 'content_control_is_accessible', $exclude, $who, $roles, $args );

		return ! $exclude;
	}

	/**
	 * Check if a content is blocked to current user.
	 *
	 * @param string $who logged_in or logged_out.
	 * @param array  $roles array of roles to check.
	 * @param array  $args context and other args to pass to the filters, generic for now so it could be extended later.
	 * @return boolean
	 */
	public static function access_blocked( $who = '', $roles = [], $args = [] ) {
		return ! static::accessible( $who, $roles, $args );
	}
}
