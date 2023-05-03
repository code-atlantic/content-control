<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;
use ContentControl\RuleEngine\Handler;

use ContentControl\Controllers\Frontend\Blocks;
use ContentControl\Frontend\Widgets;
use ContentControl\Frontend\Posts;
use ContentControl\Frontend\Feeds;
use ContentControl\Frontend\Restrictions;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend
 */
class Frontend extends Controller {

	/**
	 * Initialize Hooks & Filters
	 */
	public function init() {
		$controllers = [
			'Frontend\Blocks'  => new Blocks( $this->container ),
			'Frontend\Widgets' => new Widgets( $this->container ),
		];

		foreach ( $controllers as $controller ) {
			if ( $controller instanceof Controller ) {
				$controller->init();
			}
		}

		// TODO - Refactor for release.
		// TODO LEFT OFF HERE.

		new Posts();
		new Feeds();
		new Restrictions();
	}

}
