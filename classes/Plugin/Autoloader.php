<?php
/**
 * Includes the composer Autoloader used for packages and classes in the classes/ directory.
 *
 * @package ContentControl\Plugin
 */

namespace ContentControl\Plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Autoloader class.
 */
class Autoloader {

	/**
	 * Static-only class.
	 */
	private function __construct() {
	}

	/**
	 * Require the autoloader and return the result.
	 *
	 * If the autoloader is not present, let's log the failure and display a nice admin notice.
	 *
	 * @param string $name Plugin name for error messaging.
	 * @param string $path Path to the plugin.
	 *
	 * @return boolean
	 */
	public static function init( $name = '', $path = '' ) {
		$autoloader = $path . '/vendor/autoload.php';

		if ( ! \is_readable( $autoloader ) ) {
			self::missing_autoloader( $name );

			return false;
		}

		require_once $autoloader;

		return true;
	}

	/**
	 * If the autoloader is missing, add an admin notice.
	 *
	 *  @param string $plugin_name Plugin name for error messaging.
	 *
	 * @return void
	 */
	protected static function missing_autoloader( $plugin_name = '' ) {
		/* translators: 1. Plugin name */
		$text = __( 'Your installation of %1$s is incomplete. If you installed %1$s from GitHub, please refer to this document to set up your development environment.', 'content-control' );

		$message = sprintf( $text, $plugin_name );

		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			error_log(
				esc_html( $message )
			);
		}

		add_action(
			'admin_notices',
			function () use ( $message ) {
				?>
					<div class="notice notice-error">
						<p><?php echo esc_html( $message ); ?></p>
					</div>
				<?php
			}
		);
	}
}
