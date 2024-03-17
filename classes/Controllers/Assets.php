<?php
/**
 * Plugin assets controller.
 *
 * @package ContentControl\Admin
 * @copyright (c) 2023 Code Atlantic LLC.
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;

use function ContentControl\get_all_plugin_options;
use function ContentControl\Rules\allowed_user_roles;

defined( 'ABSPATH' ) || exit;

/**
 * Admin assets controller.
 *
 * @package ContentControl\Admin
 */
class Assets extends Controller {

	/**
	 * Initialize the assets controller.
	 */
	public function init() {
		add_action( 'wp_enqueue_scripts', [ $this, 'register_scripts' ], 0 );
		add_action( 'admin_enqueue_scripts', [ $this, 'register_scripts' ], 0 );
		add_action( 'wp_print_scripts', [ $this, 'autoload_styles_for_scripts' ], 0 );
		add_action( 'admin_print_scripts', [ $this, 'autoload_styles_for_scripts' ], 0 );
	}

	/**
	 * Get list of plugin packages.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	public function get_packages() {
		$permissions = $this->container->get_permissions();

		foreach ( $permissions as $permission => $cap ) {
			$permissions[ $permission ] = current_user_can( $cap );
		}

		$wp_version = get_bloginfo( 'version' );
		// Strip last number from version as they won't be breaking changes.
		$wp_version = preg_replace( '/\.\d+$/', '', $wp_version );

		$is_pro_installed = \ContentControl\is_plugin_installed( 'content-control-pro/content-control-pro.php' );

		$packages = [
			'block-editor'  => [
				'handle'   => 'content-control-block-editor',
				'styles'   => true,
				'varsName' => 'contentControlBlockEditor',
				'vars'     => [
					'adminUrl'       => admin_url(),
					'wpVersion'      => $wp_version,
					'pluginUrl'      => $this->container->get_url(),
					'advancedMode'   => $this->container->get_option( 'advanced_mode', false ),
					'allowedBlocks'  => [],
					'userRoles'      => allowed_user_roles(),
					'excludedBlocks' => array_merge( $this->container->get_option( 'excludedBlocks', [] ), [
						'core/nextpage',
						'core/freeform',
					] ),
					'permissions'    => $permissions,
				],
			],
			'components'    => [
				'handle' => 'content-control-components',
				'styles' => true,
				'deps'   => [
					// This is required for tinymce components.
					'wp-tinymce',
					// This is required for all tinyMCE plugins.
					'wp-block-library',
				],
			],
			'core-data'     => [
				'handle'   => 'content-control-core-data',
				'deps'     => [
					'wp-api',
				],
				'varsName' => 'contentControlCoreData',
				'vars'     => [
					'currentSettings' => get_all_plugin_options(),
				],
			],
			'data'          => [
				'handle' => 'content-control-data',
			],
			'fields'        => [
				'handle' => 'content-control-fields',
			],
			'icons'         => [
				'handle' => 'content-control-icons',
				'styles' => true,
			],
			'rule-engine'   => [
				'handle'   => 'content-control-rule-engine',
				'varsName' => 'contentControlRuleEngine',
				'vars'     => [
					'adminUrl'        => admin_url(),
					'registeredRules' => $this->container->get( 'rules' )->get_block_editor_rules(),
				],
				'styles'   => true,
			],
			'settings-page' => [
				'handle'   => 'content-control-settings-page',
				'varsName' => 'contentControlSettingsPage',
				'vars'     => [
					'pluginUrl'      => $this->container->get( 'url' ),
					'wpVersion'      => $wp_version,
					'adminUrl'       => admin_url(),
					'restBase'       => 'content-control/v2',
					'userRoles'      => allowed_user_roles(),
					'logUrl'         => current_user_can( 'manage_options' ) ? $this->container->get( 'logging' )->get_file_url() : false,
					'rolesAndCaps'   => wp_roles()->roles,
					'version'        => $this->container->get( 'version' ),
					'permissions'    => $permissions,
					'isProInstalled' => $is_pro_installed,
					'isProActivated' => $is_pro_installed && is_plugin_active( 'content-control-pro/content-control-pro.php' ),
				],
				'styles'   => true,
			],
			'utils'         => [
				'handle' => 'content-control-utils',
			],
			'widget-editor' => [
				'handle' => 'content-control-widget-editor',
				'styles' => true,
			],
		];

		return $packages;
	}

	/**
	 * Register all package scripts & styles.
	 *
	 * @return void
	 */
	public function register_scripts() {
		$packages = $this->get_packages();

		// Register front end block styles.
		wp_register_style( 'content-control-block-styles', $this->container->get_url( 'dist/style-block-editor.css' ), [], $this->container->get( 'version' ) );

		foreach ( $packages as $package => $package_data ) {
			$handle = $package_data['handle'];
			$meta   = $this->get_asset_meta( $package );

			$js_deps = isset( $package_data['deps'] ) ? $package_data['deps'] : [];

			wp_register_script( $handle, $this->container->get_url( "dist/$package.js" ), array_merge( $meta['dependencies'], $js_deps ), $meta['version'], true );

			if ( isset( $package_data['styles'] ) && $package_data['styles'] ) {
				wp_register_style( $handle, $this->container->get_url( "dist/$package.css" ), [ 'wp-components', 'wp-block-editor', 'dashicons' ], $meta['version'] );
			}

			if ( isset( $package_data['varsName'] ) && ! empty( $package_data['vars'] ) ) {
				$localized_vars = apply_filters( "content_control/{$package}_localized_vars", $package_data['vars'] );
				wp_localize_script( $handle, $package_data['varsName'], $localized_vars );
			}

			/**
			 * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
			 * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
			 * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
			 */
			wp_set_script_translations( $handle, 'content-control' );
		}
	}

	/**
	 * Auto load styles if scripts are enqueued.
	 *
	 * @return void
	 */
	public function autoload_styles_for_scripts() {
		$packages = $this->get_packages();

		foreach ( $packages as $package => $package_data ) {
			if ( wp_script_is( $package_data['handle'], 'enqueued' ) ) {
				if ( isset( $package_data['styles'] ) && $package_data['styles'] ) {
					wp_enqueue_style( $package_data['handle'] );
				}
			}
		}
	}

	/**
	 * Get asset meta from generated files.
	 *
	 * @param string $package Package name.
	 * @return array{dependencies:string[],version:string}
	 */
	public function get_asset_meta( $package ) {
		$meta_path = $this->container->get_path( "dist/$package.asset.php" );
		return file_exists( $meta_path ) ? require $meta_path : [
			'dependencies' => [],
			'version'      => $this->container->get( 'version' ),
		];
	}
}
