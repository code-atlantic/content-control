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
				'website'      => 'https://contentcontrolplugin.com',
				'support_url'  => 'https://contentcontrolplugin.com/support/',
			],
			'role'        => 'administrator',
			'caps'        => [
				'add'    => [
					$this->container->get_permission( 'manage_settings' ) => __( 'This allows us to check your global restrictions and plugin settings.', 'content-control' ),
					$this->container->get_permission( 'edit_block_controls' ) => __( 'This allows us to check your block control settings.', 'content-control' ),
				],
				'remove' => [
					// 'delete_published_pages' => 'Your published posts cannot and will not be deleted by support staff',
					// 'manage_woocommerce'     => 'We don\'t need to manage your shop!',
				],
			],
			'decay'       => WEEK_IN_SECONDS,
			'menu'        => [
				'slug' => null,
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
				'css' => $this->container->get_url( 'vendor-prefixed/trustedlogin/client/src/assets/trustedlogin.css' ),
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

}
