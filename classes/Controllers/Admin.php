<?php
/**
 * Admin controller.
 *
 * @copyright (c) 2022, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;
use ContentControl\Controllers\Admin\Reviews;
use ContentControl\Controllers\Admin\SettingsPage;
use ContentControl\Controllers\Admin\WidgetEditor;

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
			'Admin\Reviews'      => new Reviews( $this->container ),
			'Admin\Settings'     => new SettingsPage( $this->container ),
			'Admin\WidgetEditor' => new WidgetEditor( $this->container ),
		];

		foreach ( $controllers as $controller ) {
			if ( $controller instanceof Controller ) {
				$controller->init();
			}
		}
	}

}