<?php
/**
 * Admin controller.
 *
 * @copyright (c) 2022, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

/**
 * Admin controller  class.
 */
class Admin {

	public static function init() {
		Admin\Ajax::init();
		Admin\Pages::init();
		Admin\Settings::init(
			__( 'Content Control Settings', 'content-control' ),
			[
				'restrictions' => __( 'Restrictions', 'content-control' ),
				'general'      => __( 'General', 'content-control' ),
			]
		);
		Admin\Assets::init();
		Admin\Settings\Restrictions::init();

		// Admin Widget Editor
		Admin\Widget\Settings::init();

		// Admin Review Requests
		Admin\Reviews::init();
	}

}
