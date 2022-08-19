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
 */
class Admin extends Controller {

	public function init() {
		Admin\Ajax::init();
		Admin\Pages::init();

		Admin\Assets::init();
		Admin\Settings\Restrictions::init();

		// Admin Widget Editor
		Admin\Widget\Settings::init();

		Admin\Settings2::init(
			__( 'Content Control Settings', 'content-control' ),
			[
				'restrictions' => __( 'Restrictions', 'content-control' ),
				'general'      => __( 'General', 'content-control' ),
			]
		);

		// Admin Review Requests
		Admin\Reviews::init();

		$controllers = [
			'Settings' => new Admin\Settings( $this->container ),
		];

		foreach ( $controllers as $controller ) {
			if ( $controller instanceof Controller ) {
				$controller->init();
			}
		}
	}


}
