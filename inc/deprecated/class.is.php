<?php
/**
 * Deprecated Is class.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace JP\CC;

defined( 'ABSPATH' ) || exit;

/**
 * Conditional helper utilities.
 *
 * @package ContentControl
 *
 * @deprecated 2.0.0
 */
class Is {

	/**
	 * Check if a content is accessible to current user.
	 *
	 * @param string                               $who logged_in or logged_out.
	 * @param string[]|array<string,string>|string $roles array of roles to check.
	 *
	 * @return bool
	 *
	 * @deprecated 2.0.0
	 */
	public static function accessible( $who = '', $roles = [] ) {
		return \ContentControl\user_meets_requirements( $who, $roles, 'match' );
	}

	/**
	 * Check if a content is blocked to current user.
	 *
	 * @param string                               $who logged_in or logged_out.
	 * @param string[]|array<string,string>|string $roles array of roles to check.
	 *
	 * @return boolean
	 *
	 * @deprecated 2.0.0
	 */
	public static function restricted( $who = '', $roles = [] ) {
		return ! \ContentControl\user_meets_requirements( $who, $roles, 'match' );
	}
}
