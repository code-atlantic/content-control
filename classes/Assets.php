<?php
/**
 * Plugin assets controller.
 *
 * @package ContentControl\Admin
 * @copyright (c) 2023 Code Atlantic LLC.
 */

namespace ContentControl;

use ContentControl\Base\Controller;

use function ContentControl\plugin;

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
		add_action( 'wp_enqueue_scripts', [ $this, 'register_scripts' ] );
		add_action( 'wp_print_scripts', [ $this, 'autoload_styles_for_scripts' ], 0 );
		add_action( 'admin_enqueue_scripts', [ $this, 'register_scripts' ] );
		add_action( 'admin_print_scripts', [ $this, 'autoload_styles_for_scripts' ], 0 );
	}

	/**
	 * Get list of plugin packages.
	 *
	 * @return array
	 */
	public function get_packages() {
		$permissions = plugin()->get_permissions();

		foreach ( $permissions as $permission => $cap ) {
			$permissions[ $permission ] = current_user_can( $cap );
		}

		$packages = [
			'block-editor'  => [
				'handle'   => 'content-control-block-editor',
				'styles'   => true,
				'varsName' => 'contentControlBlockEditor',
				'vars'     => [
					'adminUrl'       => admin_url(),
					'pluginUrl'      => plugin()->get_url(),
					'advancedMode'   => \ContentControl\get_option( 'advancedMode' ),
					'allowedBlocks'  => [],
					'excludedBlocks' => [
						'core/nextpage',
						'core/freeform',
					],
					'permissions'    => $permissions,
				],
			],
			'components'    => [
				'handle' => 'content-control-components',
				'styles' => true,
			],
			'core-data'     => [
				'handle' => 'content-control-core-data',
				'deps'   => [
					'wp-api',
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
					'registeredRules' => plugin( 'rules' )->get_block_editor_rules(),
				],
				'styles'   => true,
			],
			'settings-page' => [
				'handle' => 'content-control-settings-page',
				'styles' => true,
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
	 */
	public function register_scripts() {
		$packages = $this->get_packages();

		foreach ( $packages as $package => $package_data ) {
			$handle = $package_data['handle'];
			$meta   = $this->get_asset_meta( $package );

			$js_deps = isset( $package_data['deps'] ) ? $package_data['deps'] : [];

			wp_register_script( $handle, plugin()->get_url( "dist/$package.js" ), array_merge( $meta['dependencies'], $js_deps ), $meta['version'], true );

			if ( isset( $package_data['styles'] ) && $package_data['styles'] ) {
				wp_register_style( $handle, plugin()->get_url( "dist/$package.css" ), [ 'wp-components', 'wp-block-editor', 'dashicons' ], $meta['version'] );
			}

			if ( isset( $package_data['varsName'] ) && ! empty( $package_data['vars'] ) ) {
				wp_localize_script( $handle, $package_data['varsName'], $package_data['vars'] );
			}
		}
	}

	/**
	 * Auto load styles if scripts are enqueued.
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
	 * @return array
	 */
	public function get_asset_meta( $package ) {
		$meta_path = "dist/$package.asset.php";
		return file_exists( plugin( 'path' ) . $meta_path ) ? require plugin( 'path' ) . $meta_path : [
			'dependencies' => [],
			'version'      => plugin( 'version' ),
		];
	}

}
