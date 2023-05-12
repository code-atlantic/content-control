<?php
/**
 * Content Control Migrations
 *
 * @package ContentControl\Core
 */

namespace ContentControl\Migrations;

use function ContentControl\plugin;

/**
 * Version 2 migration.
 */
class Version2 {

	/**
	 * Run the migration.
	 */
	public function run() {
		$tasks = [
			'migrate_user_meta',
			'migrate_wp_options',
			'migrate_restrictions',
		];

		$t = 0;

		foreach ( $tasks as $task ) {
			$this->$task();
			++$t;
		}

		if ( count( $tasks ) === $t ) {
			update_option( 'content_control_v2_ready', true );
		}
	}

	/**
	 * Convert object to array.
	 *
	 * @param object $obj Object to convert.
	 * @return array
	 */
	public function object_to_array( $obj ) {
		$array = [];
		foreach ( (array) $obj as $key => $value ) {
			$array[ $key ] = is_object( $value ) || is_array( $value ) ? self::object_to_array( $value ) : $value;
		}

		return $array;
	}

	/**
	 * Migrate plugin settings.
	 *
	 * @return void
	 */
	public function migrate_settings() {
		$settings = get_option( 'jp_cc_settings', [] );

		if ( ! empty( $settings['restrictions'] ) ) {
			$this->migrate_restrictions( $settings['restrictions'] );
		}
	}

	/**
	 * Migrate user meta.
	 *
	 * @return void
	 */
	public function migrate_user_meta() {
		$remapped_keys = [
			'_jp_cc_reviews_dismissed_triggers' => '_content_control_reviews_dismissed_triggers',
			'_jp_cc_reviews_last_dismissed'     => '_content_control_reviews_last_dismissed',
		];
	}

	/**
	 * Migrate wp_options.
	 *
	 * @return void
	 */
	public function migrate_wp_options() {
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
	}

	public function migrate_widgets() {
		// Do the option keys stay the same? If so probably need to do nothing.
	}

	/**
	 * Migrate restrictions from options to post type.
	 *
	 * @param array $restrictions Array of restrictions.
	 *
	 * @return void
	 */
	public function migrate_restrictions( $restrictions = [] ) {
		$restrictions = $this->object_to_array( $restrictions );

		// Remove array keys.
		$restrictions = array_values( $restrictions );

		$old = [
			'title'                    => '',
			'who'                      => '',
			'roles'                    => [],
			'conditions'               => '',
			'redirect_url'             => '',
			'redirect_type'            => 'login',
			'custom_message'           => '',
			'override_default_message' => false,
			'show_excerpts'            => false,
			'protection_method'        => 'redirect',
		];

		$remap = [
			'who'       => 'userStatus',
			'roles'     => 'userRoles',
			'roleMatch' => 'match', // TODO 'any' if roles is empty.
		];

		// TODO - Replace post_content with custom_message, or default global message.
	}

	/**
	 * Remap old conditions to new rules.
	 *
	 * @param array $conditions Array of old conditions.
	 * @return array
	 */
	public function remap_conditions_to_rules( $conditions ) {
		$old_rules = [
			'{$post_type}_index'         => [],
			'{$post_type}_all'           => [],
			'{$post_type}_selected'      => [
				'selected' => [],
			],
			'{$post_type}_ID'            => [
				'selected' => '',
			],
			'{$post_type}_children'      => [
				'selected' => [],
			],
			'{$post_type}_ancestors'     => [
				'selected' => '',
			],
			'{$post_type}_template'      => [
				'selected' => [],
			],
			'{$post_type}_w_{$tax_name}' => [
				'selected' => [],
			],
			'tax_{$tax_name}_all'        => [],
			'tax_{$tax_name}_selected'   => [
				'selected' => [],
			],
			'tax_{$tax_name}_ID'         => [
				'selected' => '',
			],
			'is_front_page'              => [],
			'is_home'                    => [],
			'is_search'                  => [],
			'is_404'                     => [],
		];

		return $conditions;
	}

}
