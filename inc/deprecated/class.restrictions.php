<?php
/**
 * Deprecated restrictions class.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace JP\CC\Site;

use function ContentControl\get_applicable_restriction;

defined( 'ABSPATH' ) || exit;

/**
 * Frontend restriction controller.
 */
class Restrictions {

	/**
	 * Protected posts.
	 *
	 * @var array<int>
	 */
	public static $protected_posts = [];

	/**
	 * Method to get the protected post content.
	 *
	 * @return string
	 */
	public static function restricted_content() {
		$restriction = get_applicable_restriction();
		return false !== $restriction ? $restriction->get_message() : false;
	}
}
