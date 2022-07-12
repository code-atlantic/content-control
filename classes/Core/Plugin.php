<?php
/**
 * Main plugin.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Core;

use ContentControl\Base\Container;
use ContentControl\Core\Options;
use ContentControl\Interfaces\Controller;
use ContentControl\Modules\BlockEditor;

defined( 'ABSPATH' ) || exit;

/**
 * Class Plugin
 *
 * @package ContentControl
 *
 * @property  \ContentControl\Core\Options $options
 */
class Plugin {

	/**
	 * Exposed container.
	 *
	 * @var Container
	 */
	public $container;

	/**
	 * Initiate the plugin.
	 *
	 * @param array $config Configuration variables passed from main plugin file.
	 */
	public function __construct( $config ) {
		$this->container = new Container( $config );
		$this->register_general_services();
		$this->register_plugin_services();
		$this->initiate_components();

		$this->check_version();

		add_action( 'init', [ $this, 'load_textdomain' ] );
	}

	/**
	 * Update & track version info.
	 */
	private function check_version() {
		$version    = $this->get( 'version' );
		$option_key = 'content_control_version';

		$current_data = get_option( $option_key, false );

		$data = wp_parse_args(
			false !== $current_data ? $current_data : [],
			[
				'version'         => $version,
				'upgraded_from'   => null,
				'initial_version' => $version,
				'installed_on'    => gmdate( 'Y-m-d H:i:s' ),
			]
		);

		// Process old version data storage.
		if ( false === $current_data ) {
			$data = $this->process_version_data_migration( $data );
		}

		if ( version_compare( $data['version'], $version, '<' ) ) {
			// Allow processing of small core upgrades.
			do_action( 'content_control_update_version', $data['version'] );

			// Save Upgraded From option.
			$data['upgraded_from'] = $data['version'];
			$data['version']       = $version;

			// Reset JS/CSS assets for regeneration.
			\ContentControl\reset_assets();
		}

		if ( $current_data !== $data ) {
			update_option( $option_key, $data );
		}
	}

	/**
	 * Process old version data.
	 *
	 * @param array $data Array of data.
	 * @return array
	 */
	private function process_version_data_migration( $data ) {
		$has_old_settings_data = get_option( 'jp_cc_settings', false );

		if ( false !== $has_old_settings_data ) {
			$old_data = [
				'version'         => '1.1.9',
				'upgraded_from'   => null,
				'initial_version' => '1.1.9',
			];
		}

		if ( empty( $data['initial_version'] ) ) {
			$oldest_known = $data['version'];

			if ( $data['upgraded_from'] && version_compare( $data['upgraded_from'], $oldest_known, '<' ) ) {
				$oldest_known = $data['upgraded_from'];
			}

			$data['initial_version'] = $oldest_known;
		}

		return $data;
	}

	/**
	 * Internationalization
	 */
	public function load_textdomain() {
		load_plugin_textdomain( $this->container['text_domain'], false, $this->get_path( 'languages' ) );
	}

	/**
	 * Add default services to our Container
	 */
	public function register_general_services() {
		/**
		 * Self reference for deep DI lookup.
		 */
		$this->container['plugin'] = $this;

		/**
		 * Attach utility functions.
		 */
		$this->container['get_path'] = [ $this, 'get_path' ];
		$this->container['get_url']  = [ $this, 'get_url' ];
	}

	/**
	 * Add default services to our Container
	 */
	public function register_plugin_services() {
		// Initiate various controllers.
		$this->container['options'] = function( $c ) {
			return new Options( $c->get( 'option_prefix' ) );
		};

		$this->container['rules'] = function ( $c ) {
			return new \ContentControl\Rules();
		};
	}

	/**
	 * Initiate internal components.
	 */
	private function initiate_components() {
		$this->define_paths();

		// Old.
		new \ContentControl\Frontend();
		new \ContentControl\Admin();
		new \ContentControl\Shortcodes();

		$controllers = [
			'BlockEditor' => new BlockEditor( $this ),
		];

		foreach ( $controllers as $controller ) {
			if ( $controller instanceof Controller ) {
				$controller->init();
			}
		}
	}

	/**
	 * Initiate internal paths.
	 */
	private function define_paths() {
		// Define paths.
		$this->container['dist_path'] = $this->get_path( 'dist' ) . '/';
	}

	/**
	 * Utility method to get a path.
	 *
	 * @param string $path Subpath to return.
	 * @return string
	 */
	public function get_path( $path ) {
		return $this->container['path'] . $path;
	}

	/**
	 * Utility method to get a url.
	 *
	 * @param string $path Sub url to return.
	 * @return string
	 */
	public function get_url( $path ) {
		return $this->container['url'] . $path;
	}

	/**
	 * Get item from container
	 *
	 * @param string $id Key for the item.
	 *
	 * @return mixed Current value of the item.
	 */
	public function get( $id ) {
		return $this->container->get( $id );
	}

}
