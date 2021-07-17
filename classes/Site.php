<?php


namespace JP\CC;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Site {

	public static function init() {
		Site\Posts::init();
		Site\Feeds::init();
		Site\Widgets::init();
		Site\Restrictions::init();
	}

}
