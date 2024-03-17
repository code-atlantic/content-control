<?php
/**
 * Content Control Migrations
 *
 * @package ContentControl\Plugin
 */

namespace ContentControl\Upgrades;

defined( 'ABSPATH' ) || exit;

use function ContentControl\plugin;

/**
 * User meta v2 migration.
 */
class UserMeta_2 extends \ContentControl\Base\Upgrade {

	const TYPE    = 'user_meta';
	const VERSION = 2;

	/**
	 * Get the label for the upgrade.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Migrate user meta', 'content-control' );
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
		'_jp_cc_reviews_already_did'        => 'content_control_reviews_already_did',
		'_jp_cc_reviews_dismissed_triggers' => 'content_control_reviews_dismissed_triggers',
		'_jp_cc_reviews_last_dismissed'     => 'content_control_reviews_last_dismissed',
	];

	/**
	 * Check if the upgrade is required.
	 *
	 * @return bool
	 */
	public function is_required() {
		$remaps = $this->remaps;

		foreach ( $remaps as $key => $new_key ) {
			$value = \get_user_meta( get_current_user_id(), $key, true );

			if ( [] !== $value && '' !== $value && ! is_null( $value ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Run the migration.
	 *
	 * @return void
	 */
	public function run() {
		global $wpdb;

		// Gets a stream or mock stream for sending events.
		$stream = $this->stream();

		$stream->start_task( __( 'Migrating user meta', 'content-control' ) );

		$remapped_keys = $this->remaps;

		// Update all keys via $wpdb.
		foreach ( $remapped_keys as $old_key => $new_key ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
			$wpdb->query(
				$wpdb->prepare(
					"UPDATE {$wpdb->usermeta} SET meta_key = %s WHERE meta_key = %s",
					$new_key,
					$old_key
				)
			);
		}

		$stream->complete_task( __( 'User meta migrated', 'content-control' ) );
	}
}
