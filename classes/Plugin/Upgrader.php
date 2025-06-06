<?php
/**
 * Content Control Upgrades
 *
 * @package ContentControl\Plugin
 */

namespace ContentControl\Plugin;

use ContentControl\Base\Container;

/**
 * Upgrader class.
 *
 * NOTE: For wordpress.org admins: This is only used if:
 * - The user explicitly entered a license key.
 * - They further opened a window to our site allowing the user to authorize the connection & installation of the pro upgrade.
 *
 * @package ContentControl
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
	 * Log a message to the debug log if enabled.
	 *
	 * Here to prevent constant conditional checks for the debug mode.
	 *
	 * @param string $message Message.
	 * @param string $type    Type.
	 *
	 * @return void
	 */
	public function debug_log( $message, $type = 'INFO' ) {
		if ( defined( 'CONTENT_CONTROL_UPGRADE_DEBUG_LOGGING' ) && CONTENT_CONTROL_UPGRADE_DEBUG_LOGGING ) {
			$this->c->get( 'logging' )->log( "Plugin\Upgrader.$type: $message" );
		}
	}

	/**
	 * Get credentials for the current request.
	 *
	 * @return bool
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

		$creds = request_filesystem_credentials( $url, '', false, '', null );

		if ( false === $creds || ! WP_Filesystem( $creds ) ) {
			$this->debug_log( 'Unable to get filesystem credentials.', 'ERROR' );
			return false;
		}

		return (bool) $creds;
	}

	/**
	 * Activate a plugin.
	 *
	 * @param string $plugin_basename The plugin basename.
	 * @return bool|\WP_Error
	 */
	public function activate_plugin( $plugin_basename ) {
		if ( empty( $plugin_basename ) ) {
			return new \WP_Error( 'content_control_plugin_basename', __( 'Plugin basename empty.', 'content-control' ) );
		}

		// Activate the plugin silently.
		$activated = activate_plugin( $plugin_basename, '', false, true );

		if ( is_wp_error( $activated ) ) {
			$this->debug_log( 'Plugin failed to activate: ' . $activated->get_error_message() );
			return $activated;
		}

		$this->debug_log( 'Plugin activated: ' . $plugin_basename );

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

		$installer = new \ContentControl\Installers\PluginSilentUpgrader( new \ContentControl\Installers\Install_Skin() );

		// 1. Check if the plugin exists already, if so upgrade it.

		// Error check. Sanity check to ensure install method exists.
		// @phpstan-ignore-next-line .
		if ( ! method_exists( $installer, 'install' ) ) {
			return new \WP_Error( 'content_control_upgrader', __( 'Upgrader missing install method.', 'content-control' ) );
		}

		$this->debug_log( 'Installing plugin from file: ' . $file );

		$plugin = $installer->install( $file, [
			'overwrite_package' => true,
		] );

		if ( is_wp_error( $plugin ) && 'folder_exists' === $plugin->get_error_code() ) {
			$this->debug_log( 'Plugin already exists, upgrading instead.' );

			// Plugin already exists, upgrade it.
			$plugin_basename = $installer->plugin_info();

			// Filter get_site_transient( 'update_plugins' ) to replace $plugin_basename->package with $file.
			add_filter( 'pre_site_transient_update_plugins', function ( $current ) use ( $file, $plugin_basename ) {
				if ( isset( $current->response[ $plugin_basename ] ) ) {
					$current->response[ $plugin_basename ]->package = $file;
				} else {
					$current->response[ $plugin_basename ] = (object) [
						'id'          => '0',
						'slug'        => $plugin_basename,
						'new_version' => '0',
						'url'         => '',
						'package'     => $file,
					];
				}

				$this->debug_log( 'Filtering update_plugins transient to replace package with file.' );
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
				$this->debug_log( 'Current: ' . print_r( $current->response[ $plugin_basename ], true ) );
				return $current;
			}, 10, 1 );

			$this->debug_log( 'Upgrading plugin.' );
			$upgraded = $installer->upgrade( $file );

			if ( is_wp_error( $upgraded ) ) {
				$this->debug_log( 'Error upgrading plugin: ' . $upgraded->get_error_message(), 'ERROR' );
				return $upgraded;
			}

			return $upgraded;
		}

		if ( is_wp_error( $plugin ) ) {
			$this->debug_log( 'Error installing plugin: ' . $plugin->get_error_message(), 'ERROR' );
			return $plugin;
		}

		// Flush the cache and return the newly installed plugin basename.
		wp_cache_flush();

		$plugin_basename = $installer->plugin_info();

		$this->debug_log( 'Plugin installed: ' . $plugin_basename );

		return $this->activate_plugin( $plugin_basename );
	}
}
