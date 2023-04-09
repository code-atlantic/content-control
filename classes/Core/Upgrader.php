<?php
/**
 * Content Control Upgrades
 *
 * @package ContentControl\Core
 */

namespace ContentControl\Core;

use \ContentControl\Base\Container;

/**
 * Undocumented class
 */
class Upgrader {

	/**
	 * Container.
	 *
	 * @var Container
	 */
	private $c;

	/**
	 * Initialize license management.
	 *
	 * @param Container $c Container.
	 */
	public function __construct( $c ) {
		$this->c = $c;

		$this->register_hooks();
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
	}

	/**
	 * Maybe load functions & classes required for upgrade.
	 *
	 * Purely here due to prevent possible random errors.
	 *
	 * @return void
	 */
	public function maybe_load_required_files() {
		if ( ! function_exists( 'request_filesystem_credentials' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
	}

	/**
	 * Get credentials for the current request.
	 *
	 * @return array|bool
	 */
	public function get_fs_creds() {
		// Prepare variables.
		$url = esc_url_raw(
			add_query_arg(
				[
					'page' => 'content-control-settings',
					'view' => 'upgrade',
				],
				admin_url( 'options-general.php' )
			)
		);

		$creds = request_filesystem_credentials( $url, '', false, false, null );

		if ( false === $creds || ! WP_Filesystem( $creds ) ) {
			return false;
		}

		return $creds;
	}

	/**
	 * Activate a plugin.
	 *
	 * @param string $plugin_basename The plugin basename.
	 * @return bool|\WP_Error
	 */
	public function activate_plugin( $plugin_basename ) {
		if ( ! $plugin_basename || empty( $plugin_basename ) ) {
			return new \WP_Error( 'content_control_plugin_basename', __( 'Unable to activate plugin.', 'content-control' ) );
		}

		// Activate the plugin silently.
		$activated = activate_plugin( $plugin_basename, '', false, true );

		if ( ! is_wp_error( $activated ) ) {
			return $activated;
		}

		return true;
	}

	/**
	 * Install a plugin from file.
	 *
	 * @param string $file The plugin file.
	 *
	 * @return bool|\WP_Error
	 */
	public function install_plugin( $file ) {
		// Load required files.
		$this->maybe_load_required_files();

		// Check for file system permissions.
		if ( false === $this->get_fs_creds() ) {
			return new \WP_Error( 'content_control_fs_creds', __( 'Unable to get filesystem credentials.', 'content-control' ) );
		}

		// Do not allow WordPress to search/download translations, as this will break JS output.
		remove_action( 'upgrader_process_complete', [ 'Language_Pack_Upgrader', 'async_upgrade' ], 20 );

		$installer = new \ContentControl\Admin\Installers\PluginSilentUpgrader( new \ContentControl\Admin\Installers\Install_Skin() );

		// 1. Check if the plugin exists already, if so upgrade it.

		// Error check.
		if ( ! method_exists( $installer, 'install' ) ) {
			return new \WP_Error( 'content_control_upgrader', __( 'Unable to install plugin.', 'content-control' ) );
		}

		$plugin = $installer->install( $file );

		if ( is_wp_error( $plugin ) && 'folder_exists' === $plugin->get_error_code() ) {
			// Plugin already exists, upgrade it.
			$plugin_basename = $installer->plugin_info();

			// Filter get_site_transient( 'update_plugins' ) to replace $plugin_basename->package with $file.
			add_filter( 'pre_site_transient_update_plugins', function ( $current ) use ( $file, $plugin_basename ) {
				if ( isset( $current->response[ $plugin_basename ] ) ) {
					$current->response[ $plugin_basename ]->package = $file;
				}

				return $current;
			}, 10, 1 );

			return $installer->upgrade( $file );
		}

		if ( is_wp_error( $plugin ) ) {
			return $plugin;
		}

		// Flush the cache and return the newly installed plugin basename.
		wp_cache_flush();

		$plugin_basename = $installer->plugin_info();

		return $this->activate_plugin( $plugin_basename );
	}

	/**
	 * Upgrade a plugin.
	 *
	 * @param string $plugin_basename The plugin basename.
	 * @param string $file            The plugin file.
	 *
	 * @return bool|\WP_Error
	 */
	public function upgrade_plugin( $plugin_basename, $file ) {
		// Load required files.
		$this->maybe_load_required_files();

		// Check for file system permissions.
		if ( false === $this->get_fs_creds() ) {
			return new \WP_Error( 'content_control_fs_creds', __( 'Unable to get filesystem credentials.', 'content-control' ) );
		}

		// Do not allow WordPress to search/download translations, as this will break JS output.
		remove_action( 'upgrader_process_complete', [ 'Language_Pack_Upgrader', 'async_upgrade' ], 20 );

		// Filter the plugin upgrade download URL.
		add_filter( 'upgrader_pre_download', [ $this, 'filter_plugin_download_url' ], 10, 3 );

		$upgrader = new \ContentControl\Admin\Installers\PluginSilentUpgrader( new \ContentControl\Admin\Installers\Install_Skin() );

		// Error check.
		if ( ! method_exists( $upgrader, 'upgrade' ) ) {
			return new \WP_Error( 'content_control_upgrader', __( 'Unable to upgrade plugin.', 'content-control' ) );
		}

		$plugin = $upgrader->upgrade( $file );

		if ( is_wp_error( $plugin ) ) {
			return $plugin;
		}

		// Flush the cache and return the newly installed plugin basename.
		wp_cache_flush();

		return $this->activate_plugin( $plugin_basename );
	}

}
