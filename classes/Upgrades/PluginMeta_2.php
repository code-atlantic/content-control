<?php
/**
 * Content Control Migrations
 *
 * @package ContentControl\Plugin
 */

namespace ContentControl\Upgrades;

defined( 'ABSPATH' ) || exit;

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
	 * Get the dependencies for this upgrade.
	 *
	 * @return string[]
	 */
	public function get_dependencies() {
		return [
			'backup-2',
		];
	}

	/**
	 * Get the remaps for this upgrade.
	 *
	 * @var array<string,string>
	 */
	private $remaps = [
		'jp_cc_reviews_installed_on' => 'content_control_installed_on',
	];

	/**
	 * Check if the upgrade is required.
	 *
	 * @return bool
	 */
	public function is_required() {
		$remaps = $this->remaps;

		foreach ( $remaps as $key => $new_key ) {
			$value = \get_option( $key, null );

			if ( null !== $value ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Run the upgrade.
	 *
	 * @return void
	 */
	public function run() {
		// Gets a stream or mock stream for sending events.
		$stream = $this->stream();

		$stream->start_task( __( 'Migrating plugin meta', 'content-control' ) );

		$remaps = $this->remaps;

		foreach ( $remaps as $key => $new_key ) {
			$value = \get_option( $key, null );

			if ( null !== $value ) {
				\update_option( $new_key, $value );
				\delete_option( $key );
			}
		}

		$stream->complete_task( __( 'Plugin meta migrated', 'content-control' ) );
	}
}
