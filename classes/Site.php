<?php


namespace JP\CC;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Site {

	public static function init() {
		if ( self::protection_disabled() ) {
			return;
		}

		Site\Posts::init();
		Site\Feeds::init();
		Site\Widgets::init();
		Site\Restrictions::init();
	}

	public static function protection_disabled() {
		$checks = array(
			did_action( 'elementor/loaded' ) && class_exists( '\Elementor\Plugin' ) && \Elementor\Plugin::$instance->editor->is_edit_mode(),
		);

		return in_array( true, $checks, true );
	}

}
