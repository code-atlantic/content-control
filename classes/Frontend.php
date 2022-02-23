<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend
 */
class Frontend {

	/**
	 * Initialize Hooks & Filters
	 */
	public function __construct() {
		new Frontend\Posts();
		new Frontend\Feeds();
		new Frontend\Widgets();
		new Frontend\Restrictions();
	}
}
