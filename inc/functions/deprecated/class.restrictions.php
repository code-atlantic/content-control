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

	/**
	 * Method to get the protected post content.
	 *
	 * @return string
	 */
	public static function restricted_content() {
		return plugin( 'restrictions' )->restricted_content();
	}

}
