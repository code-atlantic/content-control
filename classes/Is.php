<?php


namespace JP\CC;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Class Is
 * @package JP\CC
 */
class Is {

	/**
	 *
	 *
	 * @param string $who
	 * @param array $roles
	 * @param array $args context and other args to pass to the filters, generic for now so it could be extended later.
	 *
	 * @return bool
	 */
	public static function accessible( $who = '', $roles = array(), $args = array() ) {

		if ( is_string( $args ) ) {
			$args = array( 'context' => $args );
		}

		$args = wp_parse_args( $args, array(
			'context' => '',
		) );

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

		}

		$exclude = apply_filters( 'jp_cc_is_accessible', $exclude, $who, $roles, $args );

		return ! $exclude;
	}

	public static function access_blocked( $who = '', $roles = array(), $args = array() ) {
		return ! static::accessible( $who, $roles, $args );
	}
}
