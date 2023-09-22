<?php
/**
 * Content Control Migrations
 *
 * @package ContentControl\Plugin
 */

namespace ContentControl\Upgrades;

defined( 'ABSPATH' ) || exit;

use function __;
use function add_post_meta;
use function wp_parse_args;
use function wp_insert_post;
use function ContentControl\remap_conditions_to_query;
use function ContentControl\get_default_restriction_settings;

/**
 * Restrictions v2 migration.
 */
class Restrictions_2 extends \ContentControl\Base\Upgrade {

	const TYPE    = 'restrictions';
	const VERSION = 2;

	/**
	 * Get the label for the upgrade.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Update global restrictions', 'content-control' );
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
	 * Run the migration.
	 *
	 * @return void|\WP_Error|bool
	 */
	public function run() {
		// Gets a stream or mock stream for sending events.
		$stream = $this->stream();

		// Get settings (where restrictions were store before).
		$settings = \get_option( 'jp_cc_settings', [] );

		if ( ! is_array( $settings ) ||
			empty( $settings ) ||
			! isset( $settings['restrictions'] ) ||
			empty( $settings['restrictions'] )
		) {
			$stream->complete_task( __( 'No restrictions to migrate.', 'content-control' ) );
			return true;
		}

		$restrictions = $settings['restrictions'];
		$count        = count( $restrictions );

		if ( $count ) {
			$stream->start_task(
				// translators: %d: number of restrictions to migrate.
				sprintf( __( 'Migrating %d restrictions', 'content-control' ), $count ),
				$count
			);

			$progress = 0;

			foreach ( $restrictions as $key => $restriction ) {
				if ( $this->migrate_restriction( $restriction ) ) {
					++$progress;
					$stream->update_task_progress( $progress );

					// Unset any restrictions that were migrated.
					unset( $restrictions[ $key ] );
				} else {
					$stream->send_event(
						'task:error',
						[
							// translators: %s: restriction title.
							'message'     => sprintf( __( 'Failed to migrate restriction "%s".', 'content-control' ), $restriction['title'] ),
							'restriction' => $restriction,
						]
					);
				}
			}
		}

		if ( empty( $restrictions ) ) {
			unset( $settings['restrictions'] );
		} else {
			$settings['restrictions'] = $restrictions;
		}

		// Update the settings with any migrated restrictions removed so they can later be migrated.
		\update_option( 'jp_cc_settings', $settings );

		if ( ! $count || $progress === $count ) {
			// translators: %d: number of restrictions migrated.
			$stream->complete_task( sprintf( __( '%d restrictions migrated', 'content-control' ), $count ) );
		} else {
			$stream->send_event(
				'task:error',
				[
					// translators: %d: number of restrictions that failed to migrate.
					'message' => sprintf( __( 'Failed to migrate %d restrictions.', 'content-control' ), count( $settings['restrictions'] ) ),
				]
			);

			// Prevent marking this upgrade as complete.
			return false;
		}
	}

	/**
	 * Migrate a given restriction to the new post type.
	 *
	 * @param array<string,mixed> $restriction Restriction data.
	 *
	 * @return bool True if successful, false otherwise.
	 */
	public function migrate_restriction( $restriction ) {
		static $priority = 0;

		$restriction = wp_parse_args( $restriction, [
			'title'                    => '',
			'who'                      => '',
			'roles'                    => [],
			'protection_method'        => 'redirect',
			'show_excerpts'            => false,
			'override_default_message' => false,
			'custom_message'           => '',
			'redirect_type'            => 'login',
			'redirect_url'             => '',
			'conditions'               => '',
		]);

		$new_restriction_id = wp_insert_post(
			[
				'post_type'    => 'cc_restriction',
				'post_title'   => $restriction['title'],
				'post_content' => $restriction['custom_message'],
				'post_status'  => 'publish',
				'menu_order'   => $priority++, // Maintain order.
			]
		);

		// Convert from associative to indexed array.
		$user_roles = is_array( $restriction['roles'] ) ? array_values( $restriction['roles'] ) : [];

		$settings = wp_parse_args( [
			'userStatus'       => $restriction['who'],
			'roleMatch'        => count( $user_roles ) > 0 ? 'match' : 'any',
			'userRoles'        => $user_roles,
			'protectionMethod' => 'custom_message' === $restriction['protection_method'] ? 'replace' : 'redirect',
			'showExcerpts'     => $restriction['show_excerpts'],
			'overrideMessage'  => $restriction['override_default_message'],
			'customMessage'    => $restriction['custom_message'],
			'redirectType'     => $restriction['redirect_type'],
			'redirectUrl'      => esc_url_raw( $restriction['redirect_url'] ),
			'conditions'       => remap_conditions_to_query( $restriction['conditions'] ),
		], get_default_restriction_settings() );

		$added_meta = add_post_meta( $new_restriction_id, 'restriction_settings', $settings, true );

		return $new_restriction_id > 0 && $added_meta;
	}
}
