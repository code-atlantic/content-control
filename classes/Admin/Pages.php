<?php

// Exit if accessed directly
namespace ContentControl\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * Class Pages
 *
 * @package ContentControl\Admin
 */
class Pages {

	/**
	 *
	 */
	public static function init() {
		// add_action( 'admin_menu', [ __CLASS__, 'register_pages' ], 999 );
	}

	/**
	 * Register admin options pages.
	 */
	public static function register_pages() {
		global $content_control_settings_page;

		$content_control_settings_page = add_options_page( __( 'Content Control Pro', 'content-control' ), __( 'Content Control', 'content-control' ), 'manage_options', 'cc-settings', [
			'\\ContentControl\Admin\Settings2',
			'page',
		] );

		return $content_control_settings_page;
	}


}
