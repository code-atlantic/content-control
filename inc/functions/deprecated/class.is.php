<?php

namespace JP\CC;

// phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed

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
	 * @param string       $who logged_in or logged_out.
	 * @param array        $roles array of roles to check.
	 * @param string|array $context context and other args to pass to the filters, generic for now so it could be extended later.
	 *
	 * @return bool
	 *
	 * @deprecated 2.0.0
	 */
	public static function accessible( $who = '', $roles = [], $context = '' ) {
		return \ContentControl\user_meets_requirements( $who, $roles, 'match' );
	}

	/**
	 * Check if a content is blocked to current user.
	 *
	 * @param string       $who logged_in or logged_out.
	 * @param array        $roles array of roles to check.
	 * @param string|array $context context and other args to pass to the filters, generic for now so it could be extended later.
	 *
	 * @return boolean
	 *
	 * @deprecated 2.0.0
	 */
	public static function restricted( $who = '', $roles = [], $context = '' ) {
		return ! \ContentControl\user_meets_requirements( $who, $roles, 'match' );
	}

}
