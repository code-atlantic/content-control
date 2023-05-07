<?php
/**
 * Deprecated restrictions class.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace JP\CC\Site;

use ContentControl\Is;

use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Frontend restriction controller.
 */
class Restrictions {

	public static $protected_posts = [];

	public static function restricted_content() {
		$restrictions = Options::get( 'restrictions' );

		$restriced_content = false;

		if ( ! $restrictions || empty( $restrictions ) ) {
			return $restriced_content;
		}

		foreach ( $restrictions as $restriction ) {
			if ( static::content_match( $restriction ) ) {
				$roles = ! empty( $restriction['roles'] ) ? $restriction['roles'] : [];

				if ( Is::access_blocked( $restriction['who'], $roles, [ 'context' => 'content_restrictions' ] ) ) {
					$restriced_content = $restriction;
				}
				break;
			}
		}

		return $restriced_content;
	}

}
