<?php
/**
 * Widget utility functions.
 *
 * @package ContentControl
 * @copyright (c) 2023 Code Atlantic LLC.
 */

namespace ContentControl\Widgets;

/**
 * Retrieve data for a widget from options table.
 *
 * @param string $widget_id The unique ID of a widget.
 *
 * @return array<string,mixed> The array of widget settings or empty array if none
 */
function get_options( $widget_id ) {
	static $options = [];

	// If already loaded, return existing settings.
	if ( ! isset( $options[ $widget_id ] ) ) {
		$split_pos = strrpos( $widget_id, '-' );

		if ( false === $split_pos ) {
			return [];
		}

		// Examples: "text-2" will return "text", "recent-post-2" will return "recent-post".
		$basename = substr( $widget_id, 0, $split_pos );

		// Examples: "text-2" will return "2", "recent-post-2" will return "2".
		$index = substr( $widget_id, $split_pos + 1 );

		$widget_settings = \get_option( 'widget_' . $basename );

		if ( isset( $widget_settings[ $index ] ) ) {
			$options[ $widget_id ] = parse_options( $widget_settings[ $index ] );
		}
	}

	return parse_options( isset( $options[ $widget_id ] ) ? $options[ $widget_id ] : [] );
}

/**
 * Checks for & adds missing widget options to prevent errors or missing data.
 *
 * @param array<string,mixed> $options Widget options.
 *
 * @return array<string,mixed>
 */
function parse_options( $options = [] ) {
	return wp_parse_args( $options, [
		'which_users' => '',
		'roles'       => [],
	] );
}
