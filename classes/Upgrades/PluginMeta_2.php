<?php
/**
 * Content Control Migrations
 *
 * @package ContentControl\Plugin
 */

namespace ContentControl\Upgrades;

defined( 'ABSPATH' ) || exit;

use function __;
use function get_option;
use function update_option;
use function delete_option;

/**
 * Version 2 migration.
 */
class PluginMeta_2 extends \ContentControl\Base\Upgrade {

	const TYPE    = 'plugin_meta';
	const VERSION = 2;

	/**
	 * Get the label for the upgrade.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Update plugin meta', 'content-control' );
	}

	/**
	 * Run the upgrade.
	 *
	 * @return void|WP_Error|false
	 */
	public function run() {
		// Gets a stream or mock stream for sending events.
		$stream = $this->stream();

		$stream->send_event(
			'task:start',
			[
				'task'    => 'migrate_plugin_meta',
				'message' => __( 'Migrating plugin meta', 'content-control' ),
			]
		);

		$remaps = [
			'jp_cc_reviews_installed_on' => 'content_control_installed_on',
		];

		foreach ( $remaps as $key => $new_key ) {
			$value = get_option( $key, null );

			if ( null !== $value ) {
				update_option( $new_key, $value );
				delete_option( $key );
			}
		}

		$stream->send_event(
			'task:complete',
			[
				'task'    => 'migrate_plugin_meta',
				'message' => __( 'Plugin meta migrated', 'content-control' ),
			]
		);
	}

}
