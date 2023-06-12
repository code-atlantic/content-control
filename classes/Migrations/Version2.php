<?php
/**
 * Content Control Migrations
 *
 * @package ContentControl\Plugin
 */

namespace ContentControl\Migrations;

defined( 'ABSPATH' ) || exit;

use function ContentControl\plugin;

/**
 * Version 2 migration.
 */
class Version2 {

	/**
	 * Stream.
	 *
	 * @var \ContentControl\Base\Stream
	 */
	private $stream;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->stream = new \ContentControl\Base\Stream( 'cc-v2-migration' );
	}

	/**
	 * Run the migration.
	 */
	public function run() {
		$this->stream->start();

		$this->stream->send_event( 'start' );

		$tasks = [
			'migrate_restrictions',
			'migrate_plugin_settings',
			'migrate_user_meta',
			'migrate_plugin_meta',
		];

		$t = 0;

		foreach ( $tasks as $task ) {
			$this->$task();
			++$t;
		}

		if ( count( $tasks ) === $t ) {
			$this->stream->send_event( 'complete' );

			$data_versioning = \get_option( 'content_control_data_versioning', [] );

			$data_versioning['settings']     = 2;
			$data_versioning['restrictions'] = 2;

			\update_option( 'content_control_data_versioning', $data_versioning );
		}
	}

	/**
	 * Migrate restrictions from options to post type.
	 *
	 * @param array $restrictions Array of restrictions.
	 *
	 * @return void
	 */
	public function migrate_restrictions( $restrictions = [] ) {
		$settings = \get_option( 'jp_cc_settings', [] );

		$count = isset( $settings['restrictions'] ) ? count( $settings['restrictions'] ) : 0;

		if ( $count ) {
			$this->stream->send_event(
				'task:start',
				[
					'task'  => 'migrate_restrictions',
					'total' => $count,
				]
			);

			foreach ( $restrictions as $key => $restriction ) {
				if ( $this->migrate_restriction( $restriction ) ) {
					// Unset any restrictions that were migrated.
					unset( $settings['restrictions'][ $key ] );

					$this->stream->send_error(
						'task:progress',
						[
							'task'     => 'migrate_restrictions',
							'progress' => $key + 1,
						]
					);
				} else {
					$this->stream->send_error(
						'task:error',
						[
							'task'        => 'migrate_restrictions',
							'progress'    => $key + 1,
							'message'     => 'Failed to migrate restriction.',
							'restriction' => $restriction,
						]
					);
				}
			}
		}

		if ( empty( $settings['restrictions'] ) ) {
			unset( $settings['restrictions'] );

			$this->stream->send_event(
				'task:complete',
				[
					'task' => 'migrate_restrictions',
				]
			);
		} else {
			$this->stream->send_error(
				'task:error',
				[
					'task'         => 'migrate_restrictions',
					'message'      => 'Failed to migrate all restrictions.',
					'restrictions' => $settings['restrictions'],
				]
			);
		}

		// Update the settings with any migrated restrictions removed.
		\update_option( 'jp_cc_settings', $settings );
	}

	/**
	 * Migrate a given restriction to the new post type.
	 *
	 * @param array $restriction Restriction data.
	 *
	 * @return bool True if successful, false otherwise.
	 */
	public function migrate_restriction( $restriction ) {
		$restriction = \wp_parse_args( $restriction, [
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

		$new_restriction_id = \wp_insert_post(
			[
				'post_type'    => 'cc_restriction',
				'post_title'   => $restriction['title'],
				'post_content' => $restriction['custom_message'],
				'post_status'  => 'publish',
			]
		);

		$user_roles = is_array( $restriction['roles'] ) ? $restriction['roles'] : [];

		$settings = [
			'userStatus'       => $restriction['who'],
			'roleMatch'        => count( $user_roles ) > 0 ? 'match' : 'any',
			'userRoles'        => $user_roles,
			'protectionMethod' => 'custom_message' === $restriction['protection_method'] ? 'message' : 'redirect',
			'redirectType'     => $restriction['redirect_type'],
			'redirectUrl'      => \sanitize_url( $restriction['redirect_url'] ),
			'overrideMessage'  => $restriction['override_default_message'],
			'customMessage'    => $restriction['custom_message'],
			'showExcerpts'     => $restriction['show_excerpts'],
			'conditions'       => \ContentControl\remap_conditions_to_query( $restriction['conditions'] ),
		];

		$added_meta = \add_post_meta( $new_restriction_id, 'restriction_settings', $settings, true );

		return $new_restriction_id > 0 && $added_meta;
	}

	/**
	 * Migrate plugin settings.
	 *
	 * @return void
	 */
	public function migrate_plugin_settings() {
		$this->stream->send_event(
			'task:start',
			[
				'task' => 'migrate_plugin_settings',
			]
		);

		$settings             = get_option( 'jp_cc_settings', [] );
		$defaultDenialMessage = isset( $settings['default_denial_message'] ) ? $settings['default_denial_message'] : '';

		if ( ! empty( $defaultDenialMessage ) ) {
			plugin()->get( 'options' )->update( 'defaultDenialMessage', $defaultDenialMessage );
		}

		$this->stream->send_event(
			'task:complete',
			[
				'task' => 'migrate_plugin_settings',
			]
		);
	}

	/**
	 * Migrate user meta.
	 *
	 * @return void
	 */
	public function migrate_user_meta() {
		global $wpdb;

		$this->stream->send_event(
			'task:start',
			[
				'task' => 'migrate_user_meta',
			]
		);

		$remapped_keys = [
			'_jp_cc_reviews_dismissed_triggers' => 'content_control_reviews_dismissed_triggers',
			'_jp_cc_reviews_last_dismissed'     => 'content_control_reviews_last_dismissed',
		];

		// Update all keys via $wpdb.
		foreach ( $remapped_keys as $old_key => $new_key ) {
			$wpdb->query(
				$wpdb->prepare(
					"UPDATE {$wpdb->usermeta} SET meta_key = %s WHERE meta_key = %s",
					$new_key,
					$old_key
				)
			);
		}

		$this->stream->send_event(
			'task:complete',
			[
				'task' => 'migrate_user_meta',
			]
		);
	}

	/**
	 * Migrate wp_options.
	 *
	 * @return void
	 */
	public function migrate_plugin_meta() {
		$this->stream->send_event(
			'task:start',
			[
				'task' => 'migrate_plugin_meta',
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

		$this->stream->send_event(
			'task:complete',
			[
				'task' => 'migrate_plugin_meta',
			]
		);
	}

}
