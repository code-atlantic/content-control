<?php

namespace JP\CC;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class JP\CC\Widgets
 */
class Widget {

	/**
	 * Retrieve data for a widget from options table.
	 *
	 * @param string $widget_id The unique ID of a widget.
	 *
	 * @return array The array of widget settings or empty array if none
	 */
	public static function get_options( $widget_id ) {

		static $options = array();

		// If already loaded, return existing settings.
		if ( ! isset( $options[ $widget_id ] ) ) {

			$split_pos = strrpos( $widget_id, '-' );

			if ( false === $split_pos ) {
				return array();
			}

			$basename = substr( $widget_id, 0, $split_pos ); // Examples: "text-2" will return "text", "recent-post-2" will return "recent-post"
			$index    = substr( $widget_id, $split_pos + 1 ); // Examples: "text-2" will return "2", "recent-post-2" will return "2"

			$widget_settings = get_option( 'widget_' . $basename );

			if ( isset( $widget_settings[ $index ] ) ) {
				$options[ $widget_id ] = static::parse_options( $widget_settings[ $index ] );
			}

		}

		return $options[ $widget_id ];
	}

	/**
	 * Checks for & adds missing widget options to prevent errors or missing data.
	 *
	 * @param array $options
	 *
	 * @return array
	 */
	public static function parse_options( $options = array() ) {

		if ( ! is_array( $options ) ) {
			$options = array();
		}

		return wp_parse_args( $options, array(
			'which_users' => '',
			'roles'       => array(),
		) );
	}

}
