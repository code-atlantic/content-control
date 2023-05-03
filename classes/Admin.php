<?php
/**
 * Admin controller.
 *
 * @copyright (c) 2022, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl;

use ContentControl\Base\Controller;

defined( 'ABSPATH' ) || exit;

/**
 * Admin controller  class.
 *
 * @package ContentControl
 */
class Admin extends Controller {

	/**
	 * Initialize admin controller.
	 *
	 * @return void
	 */
	public function init() {
		$controllers = [
			'Admin\Settings'     => new Admin\SettingsPage( $this->container ),
			'Admin\WidgetEditor' => new Admin\WidgetEditor( $this->container ),
		];

		foreach ( $controllers as $controller ) {
			if ( $controller instanceof Controller ) {
				$controller->init();
			}
		}

		// TODO - Refactor for release.
		// Admin Review Requests.
		Admin\Reviews::init();
	}


}
