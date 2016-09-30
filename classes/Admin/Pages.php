<?php

// Exit if accessed directly
namespace JP\CC\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pages
 * @package JP\CC\Admin
 */
class Pages {

	/**
	 *
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'register_pages' ), 999 );
	}

	/**
	 * Register admin options pages.
	 */
	public static function register_pages() {
		global $jp_cc_settings_page;

		$jp_cc_settings_page = add_options_page( __( 'Content Control', 'content-control' ), __( 'Content Control', 'content-control' ), 'manage_options', 'jp-cc-settings', array(
			'\\JP\CC\Admin\Settings',
			'page',
		) );

		return $jp_cc_settings_page;
	}


}
