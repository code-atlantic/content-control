<?php
/**
 * Content Control Migrations
 *
 * @package ContentControl\Plugin
 */

namespace ContentControl\Upgrades;

defined( 'ABSPATH' ) || exit;

use function __;
use function ContentControl\update_plugin_option;

/**
 * Settings v2 migration.
 */
class Settings_2 extends \ContentControl\Base\Upgrade {

	const TYPE    = 'settings';
	const VERSION = 2;

	/**
	 * Get the label for the upgrade.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Update plugin settings', 'content-control' );
	}

	/**
	 * Get the dependencies for this upgrade.
	 *
	 * @return string[]
	 */
	public function get_dependencies() {
		return [
			'backup-2',
			'restrictions-2',
		];
	}

	/**
	 * Run the migration.
	 *
	 * @return void
	 */
	public function run() {
		// Gets a stream or mock stream for sending events.
		$stream = $this->stream();

		$stream->start_task( __( 'Migrating plugin settings', 'content-control' ) );

		$settings = \get_option( 'jp_cc_settings', [] );

		if ( ! is_array( $settings ) ||
			empty( $settings )
		) {
			$settings = [];
		}

		$default_denial_message = isset( $settings['default_denial_message'] ) ? $settings['default_denial_message'] : '';

		// For migrations, maintain the old default of not excluding admins.
		update_plugin_option( 'excludeAdmins', false );

		if ( ! empty( $default_denial_message ) ) {
			update_plugin_option( 'defaultDenialMessage', $default_denial_message );
		}

		unset( $settings['default_denial_message'] );

		if ( ! empty( $settings ) ) {
			\update_option( 'jp_cc_settings', $settings );
		} else {
			\delete_option( 'jp_cc_settings' );
		}

		$stream->complete_task( __( 'Plugin settings migrated', 'content-control' ) );
	}
}
