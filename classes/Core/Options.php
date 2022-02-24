<?php
/**
 * Plugin options manager..
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl\Core
 */

namespace ContentControl\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Class Options
 */
class Options {

	/**
	 * Unique Prefix per plugin.
	 *
	 * @var string
	 */
	public $prefix;

	/**
	 * Keeps static copy of the options during runtime.
	 *
	 * @var null|array
	 */
	private $data;

	/**
	 * Initialize Options on run.
	 *
	 * @param string $prefix Settings key prefix.
	 */
	public function __construct( $prefix = 'content_control' ) {
		// Set the prefix on init.
		static::$prefix = ! empty( $prefix ) ? trim( $prefix, '_' ) . '_' : '';
		static::$data   = static::get_all();
	}

	/**
	 * Get Settings
	 *
	 * Retrieves all plugin settings
	 *
	 * @return array settings
	 */
	public function get_all() {
		$settings = get_option( static::$prefix . 'settings' );
		if ( ! is_array( $settings ) ) {
			$settings = [];
		}

		return apply_filters( static::$prefix . 'get_options', $settings );
	}

	/**
	 * Get an option
	 *
	 * Looks to see if the specified setting exists, returns default if not
	 *
	 * @param string $key
	 * @param bool   $default
	 *
	 * @return mixed|void
	 */
	public static function get( $key = '', $default = false ) {
		$value = isset( static::$data[ $key ] ) ? static::$data[ $key ] : $default;

		return apply_filters( static::$prefix . 'get_option', $value, $key, $default );
	}

	/**
	 * Update an option
	 *
	 * Updates an setting value in both the db and the global variable.
	 * Warning: Passing in an empty, false or null string value will remove
	 *          the key from the _options array.
	 *
	 * @since 1.0.0
	 *
	 * @param string          $key The Key to update
	 * @param string|bool|int $value The value to set the key to
	 *
	 * @return boolean True if updated, false if not.
	 */
	public static function update( $key = '', $value = false ) {

		// If no key, exit
		if ( empty( $key ) ) {
			return false;
		}

		if ( empty( $value ) ) {
			$remove_option = static::delete( $key );

			return $remove_option;
		}

		// First let's grab the current settings
		$options = (array) get_option( static::$prefix . 'settings', [] );

		// Let's let devs alter that value coming in
		$value = apply_filters( static::$prefix . 'update_option', $value, $key );

		// Next let's try to update the value
		$options[ $key ] = $value;
		$did_update      = update_option( static::$prefix . 'settings', $options );

		// If it updated, let's update the global variable
		if ( $did_update ) {
			static::$data[ $key ] = $value;
		}

		return $did_update;
	}

	/**
	 * Remove an option
	 *
	 * Removes a setting value in both the db and the global variable.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key The Key to delete
	 *
	 * @return boolean True if updated, false if not.
	 */
	public static function delete( $key = '' ) {

		// If no key, exit
		if ( empty( $key ) ) {
			return false;
		}

		// First let's grab the current settings
		$options = get_option( static::$prefix . 'settings' );

		// Next let's try to update the value
		if ( isset( $options[ $key ] ) ) {
			unset( $options[ $key ] );
		}

		$did_update = update_option( static::$prefix . 'settings', $options );

		// If it updated, let's update the global variable
		if ( $did_update ) {
			static::$data = $options;
		}

		return $did_update;
	}

}
