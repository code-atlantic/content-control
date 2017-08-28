<?php


namespace JP\CC;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Admin {

	public static function init() {
		Admin\Ajax::init();
		Admin\Pages::init();
		Admin\Settings::init(
			__( 'Content Control Settings', 'content-control' ),
			array(
				'restrictions' => __( 'Restrictions', 'content-control' ),
				'general' => __( 'General', 'content-control' ),
			)
		);
		Admin\Assets::init();
		Admin\Settings\Restrictions::init();

		// Admin Widget Editor
		Admin\Widget\Settings::init();

		// Admin Review Requests
		Admin\Reviews::init();
	}

}
