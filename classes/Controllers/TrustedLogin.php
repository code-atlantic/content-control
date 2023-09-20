<?php
/**
 * TrustedLogin.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;
use ContentControl\Vendor\TrustedLogin\Client;
use ContentControl\Vendor\TrustedLogin\Config;

defined( 'ABSPATH' ) || exit;

/**
 * TrustedLogin.
 *
 * @package ContentControl
 */
class TrustedLogin extends Controller {

	/**
	 * TrustedLogin init.
	 */
	public function init() {
		$this->hooks();

		$config = [
			'auth'        => [
				'api_key'     => 'f97f5be6e02d1565',
				'license_key' => $this->container->get( 'license' )->get_license_key(),
			],
			'vendor'      => [
				'namespace'    => 'content-control',
				'title'        => 'Content Control',
				'display_name' => 'Content Control Support',
				'logo_url'     => $this->container->get_url( 'assets/images/logo.svg' ),
				'email'        => 'support+{hash}@contentcontrolplugin.com',
				'website'      => 'https://contentcontrolplugin.com?utm_campaign=grant-access&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=grant-access-title-link',
				'support_url'  => 'https://contentcontrolplugin.com/support/?utm_campaign=grant-access&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=support-footer-link',
			],
			'role'        => 'administrator',
			'caps'        => [
				'add'    => [
					$this->container->get_permission( 'manage_settings' ) => __( 'This allows us to check your global restrictions and plugin settings.', 'content-control' ),
					$this->container->get_permission( 'edit_block_controls' ) => __( 'This allows us to check your block control settings.', 'content-control' ),
				],
				'remove' => [
					'delete_published_pages' => 'Your published posts cannot and will not be deleted by support staff',
					'manage_woocommerce'     => 'We don\'t need to manage your shop!',
				],
			],
			'decay'       => WEEK_IN_SECONDS,
			'menu'        => [
				'slug' => false,
			],
			'logging'     => [
				'enabled' => false,
			],
			'require_ssl' => false,
			'webhook'     => [
				'url'           => null,
				'debug_data'    => false,
				'create_ticket' => false,
			],
			'paths'       => [
				'js'  => $this->container->get_url( 'vendor-prefixed/trustedlogin/client/src/assets/trustedlogin.js' ),
				'css' => $this->container->get_url( 'dist/settings-page.css' ),
			],
		];

		try {
			new Client(
				new Config( $config )
			);
		} catch ( \Exception $exception ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			\error_log( $exception->getMessage() );
		}
	}

	/**
	 * Hooks.
	 *
	 * @return void
	 */
	public function hooks() {
		add_action( 'admin_menu', [ $this, 'admin_menu' ] );
	}

	/**
	 * Admin menu.
	 *
	 * @return void
	 */
	public function admin_menu() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! isset( $_GET['page'] ) || 'grant-content-control-access' !== $_GET['page'] ) {
			return;
		}

		add_options_page(
			__( 'Content Control Support Access', 'content-control' ),
			__( 'Content Control Support Access', 'content-control' ),
			$this->container->get_permission( 'manage_settings' ),
			'grant-content-control-access',
			function () {
				// phpcs:ignore WordPress.NamingConventions.ValidHookName.UseUnderscores
				do_action( 'trustedlogin/content-control/auth_screen' );
			}
		);
	}
}
