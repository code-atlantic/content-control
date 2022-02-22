<?php
/**
 * Includes the composer Autoloader used for packages and classes in the classes/ directory.
 *
 * @package ContentControls
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

/**
 * Autoloader class.
 *
 * @since 1.0.0
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
	 *  @param string $plugin_name Plugin name for error messaging.
	 *
	 * @return boolean
	 */
	public static function init( $plugin_name = '' ) {
		$autoloader = dirname( __DIR__ ) . '/vendor/autoload.php';

		if ( ! \is_readable( $autoloader ) ) {
			self::missing_autoloader( $plugin_name );

			return false;
		}

		return require $autoloader;
	}

	/**
	 * If the autoloader is missing, add an admin notice.
	 *
	 *  @param string $plugin_name Plugin name for error messaging.
	 */
	protected static function missing_autoloader( $plugin_name = '' ) {
		/* translators: 1. Plugin name */
		$message = sprintf( esc_html__( 'Your installation of %1$s is incomplete. If you installed %1$s from GitHub, please refer to this document to set up your development environment.', 'content-control' ), $plugin_name );

		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log(  // phpcs:ignore
				$message
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
