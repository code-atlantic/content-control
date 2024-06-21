<?php
/**
 * Main plugin.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Plugin;

use ContentControl\Base\Container;
use ContentControl\Plugin\Options;
use ContentControl\Interfaces\Controller;

defined( 'ABSPATH' ) || exit;

/**
 * Class Plugin
 *
 * @package ContentControl\Plugin
 *
 * @version 2.0.0
 */
class Core {

	/**
	 * Exposed container.
	 *
	 * @var Container
	 */
	public $container;

	/**
	 * Array of controllers.
	 *
	 * Useful to unhook actions/filters from global space.
	 *
	 * @var Container
	 */
	public $controllers;

	/**
	 * Initiate the plugin.
	 *
	 * @param array<string,string|bool> $config Configuration variables passed from main plugin file.
	 */
	public function __construct( $config ) {
		$this->container   = new Container( $config );
		$this->controllers = new Container();

		$this->register_services();
		$this->define_paths();
		$this->initiate_controllers();

		$this->check_version();

		add_action( 'init', [ $this, 'load_textdomain' ] );
	}

	/**
	 * Update & track version info.
	 *
	 * @return void
	 */
	protected function check_version() {
		$version    = $this->get( 'version' );
		$option_key = "{$this->get( 'option_prefix' )}_version";

		$current_data = \get_option( $option_key, false );

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

		if ( version_compare( $data['version'], (string) $version, '<' ) ) {
			// Allow processing of small core upgrades.

			/**
			 * Fires when the plugin version is updated.
			 *
			 * Note: Old version is still available in options.
			 *
			 * @param string $version The new version.
			 */
			do_action( "{$this->get( 'option_prefix' )}/update_version", $data['version'] );

			// Save Upgraded From option.
			$data['upgraded_from'] = $data['version'];
			$data['version']       = $version;
		}

		if ( $current_data !== $data ) {
			\update_option( $option_key, $data );
		}
	}

	/**
	 * Process old version data.
	 *
	 * @param array<string,string|null> $data Array of data.
	 * @return array<string,string|null>
	 */
	protected function process_version_data_migration( $data ) {
		// This class can be extended for addons, only do the following if this is core and not an extended class.
		// If the current instance is not an extended class, check if old settings exist.
		if ( get_called_class() === __CLASS__ ) {
			// Check if old settings exist.
			$has_old_settings_data = \get_option( 'content_control_settings', false );
			$has_old_install_date  = \get_option( 'content_control_installed_on', false );

			if ( false !== $has_old_settings_data || false !== $has_old_install_date ) {
				$data = [
					'version'         => '1.1.9',
					'upgraded_from'   => null,
					'initial_version' => '1.1.9',
				];
			}

			$has_old_settings_data = \get_option( 'jp_cc_settings', false );
			$has_old_install_date  = \get_option( 'jp_cc_reviews_installed_on', false );

			// Check if old settings exist.
			if ( false !== $has_old_settings_data || false !== $has_old_install_date ) {
				$data = [
					'version'         => '1.1.9',
					'upgraded_from'   => null,
					'initial_version' => '1.1.9',
				];
			}
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
	 * Internationalization.
	 *
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( $this->container['text_domain'], false, $this->get_path( 'languages' ) );
	}

	/**
	 * Add default services to our Container.
	 *
	 * @return void
	 */
	public function register_services() {
		/**
		 * Self reference for deep DI lookup.
		 */
		$this->container['plugin'] = $this;

		/**
		 * Attach our container to the global.
		 */
		$GLOBALS[ $this->get( 'option_prefix' ) ] = $this->container;

		if ( get_called_class() === __CLASS__ ) {
			$this->container['options'] =
				/**
				 * Get plugin options.
				 *
				 * @return Options
				 */
				function ( $c ) {
					return new Options( $c->get( 'option_prefix' ) );
				};

			$this->container['connect'] =
				/**
				 * Get plugin connect.
				 *
				 * @return Connect
				 */
				function ( $c ) {
					return new \ContentControl\Plugin\Connect( $c );
				};

			$this->container['license'] =
				/**
				 * Get plugin license.
				 *
				 * @return License
				 */
				function () {
					return new \ContentControl\Plugin\License();
				};

			$this->container['logging'] =
				/**
				 * Get plugin logging.
				 *
				 * @return Logging
				 */
				function () {
					return new \ContentControl\Plugin\Logging();
				};

			$this->container['upgrader'] =
				/**
				 * Get plugin upgrader.
				 *
				 * @return Upgrader
				 */
				function ( $c ) {
					return new \ContentControl\Plugin\Upgrader( $c );
				};

			$this->container['rules'] =
				/**
				 * Get plugin rules.
				 *
				 * @return \ContentControl\RuleEngine\Rules
				 */
				function () {
					return new \ContentControl\RuleEngine\Rules();
				};

			$this->container['restrictions'] =
				/**
				 * Get plugin restrictions.
				 *
				 * @return \ContentControl\Services\Restrictions
				 */
				function () {
					return new \ContentControl\Services\Restrictions();
				};

			$this->container['globals'] =
				/**
				 * Get plugin global manager.
				 *
				 * @return \ContentControl\Services\Globals
				 */
				function () {
					return new \ContentControl\Services\Globals();
				};
		}

		apply_filters( "{$this->get( 'option_prefix' )}/register_services", $this->container, $this );
	}

	/**
	 * Update & track version info.
	 *
	 * @return array<string,\ContentControl\Base\Controller>
	 */
	protected function registered_controllers() {
		return [
			'PostTypes'              => new \ContentControl\Controllers\PostTypes( $this ),
			'Assets'                 => new \ContentControl\Controllers\Assets( $this ),
			'Admin'                  => new \ContentControl\Controllers\Admin( $this ),
			'Compatibility'          => new \ContentControl\Controllers\Compatibility( $this ),
			'RestAPI'                => new \ContentControl\Controllers\RestAPI( $this ),
			'BlockEditor'            => new \ContentControl\Controllers\BlockEditor( $this ),
			'Frontend'               => new \ContentControl\Controllers\Frontend( $this ),
			'Shortcodes'             => new \ContentControl\Controllers\Shortcodes( $this ),
			'TrustedLoginController' => new \ContentControl\Controllers\TrustedLogin( $this ),
		];
	}

	/**
	 * Initiate internal components.
	 *
	 * @return void
	 */
	protected function initiate_controllers() {
		$this->register_controllers( $this->registered_controllers() );
	}

	/**
	 * Register controllers.
	 *
	 * @param array<string,Controller> $controllers Array of controllers.
	 * @return void
	 */
	public function register_controllers( $controllers = [] ) {
		foreach ( $controllers as $name => $controller ) {
			if ( $controller instanceof Controller ) {
				if ( $controller->controller_enabled() ) {
					$controller->init();
				}
				$this->controllers->set( $name, $controller );
			}
		}
	}

	/**
	 * Get a controller.
	 *
	 * @param string $name Controller name.
	 *
	 * @return Controller|null
	 */
	public function get_controller( $name ) {
		$controller = $this->controllers->get( $name );

		if ( $controller instanceof Controller ) {
			return $controller;
		}

		return null;
	}

	/**
	 * Initiate internal paths.
	 *
	 * @return void
	 */
	protected function define_paths() {
		/**
		 * Attach utility functions.
		 */
		$this->container['get_path'] = [ $this, 'get_path' ];
		$this->container['get_url']  = [ $this, 'get_url' ];

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
	public function get_url( $path = '' ) {
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
		// 1. Check if the item exists in the container.
		if ( $this->container->offsetExists( $id ) ) {
			return $this->container->get( $id );
		}

		// 2. Check if the item exists in the controllers container.
		if ( $this->controllers->offsetExists( $id ) ) {
			return $this->controllers->get( $id );
		}

		// 3. Check if the item exists in the global space.
		if ( get_called_class() !== __CLASS__ ) {
			// If this is an addon, check if the service exists in the core plugin.
			// Get core plugin container and see if the service exists there.
			$plugin_service = \ContentControl\plugin( $id );

			if ( $plugin_service ) {
				return $plugin_service;
			}
		}

		// 5. Return null, item not found.
		return null;
	}

	/**
	 * Set item in container
	 *
	 * @param string $id Key for the item.
	 * @param mixed  $value Value to set.
	 *
	 * @return void
	 */
	public function set( $id, $value ) {
		$this->container->set( $id, $value );
	}

	/**
	 * Get plugin option.
	 *
	 * @param string        $key Option key.
	 * @param boolean|mixed $default_value Default value.
	 * @return mixed
	 */
	public function get_option( $key, $default_value = false ) {
		return $this->get( 'options' )->get( $key, $default_value );
	}

	/**
	 * Get plugin permissions.
	 *
	 * @return array<string,string> Array of permissions.
	 */
	public function get_permissions() {
		$permissions = \ContentControl\get_default_permissions();

		$user_permisions = $this->get( 'options' )->get( 'permissions', [] );

		if ( ! empty( $user_permisions ) ) {
			foreach ( $user_permisions as $cap => $user_permission ) {
				if ( ! empty( $user_permission ) ) {
					$permissions[ $cap ] = $user_permission;
				}
			}
		}

		return $permissions;
	}

	/**
	 * Get plugin permission for capability.
	 *
	 * @param string $cap Permission key.
	 *
	 * @return string User role or cap required.
	 */
	public function get_permission( $cap ) {
		$permissions = $this->get_permissions();

		return isset( $permissions[ $cap ] ) ? $permissions[ $cap ] : 'manage_options';
	}

	/**
	 * Check if pro version is installed.
	 *
	 * @return boolean
	 */
	public function is_pro_installed() {
		return file_exists( WP_PLUGIN_DIR . '/content-control-pro/content-control-pro.php' );
	}

	/**
	 * Check if pro version is active.
	 *
	 * @return boolean
	 */
	public function is_pro_active() {
		return $this->is_pro_installed() && function_exists( '\ContentControl\Pro\plugin' );
	}

	/**
	 * Check if license is active.
	 *
	 * @return boolean
	 */
	public function is_license_active() {
		return $this->get( 'license' )->is_license_active();
	}
}
