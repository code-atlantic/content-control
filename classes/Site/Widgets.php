<?php

namespace JP\CC\Site;

use JP\CC\Helpers;
use JP\CC\Widget;
use JP\CC\Is;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class JP\CC\Site\Widgets
 */
class Widgets {

	/**
	 * Initialize Widgets
	 */
	public static function init() {
		add_action( 'sidebars_widgets', array( __CLASS__, 'exclude_widgets' ) );
	}

	/**
	 * Checks for and excludes widgets based on their chosen options.
	 *
	 * @param array $widget_areas An array of widget areas and their widgets.
	 *
	 * @return array The modified $widget_area array.
	 */
	public static function exclude_widgets( $widget_areas ) {

		if ( is_admin() || Helpers::is_customize_preview() ) {
			return $widget_areas;
		}

		foreach ( $widget_areas as $widget_area => $widgets ) {

			if ( ! empty( $widgets ) && 'wp_inactive_widgets' != $widget_area ) {

				foreach ( $widgets as $position => $widget_id ) {

					$options = Widget::get_options( $widget_id );

					// If not accessible then exclude this item.
					$exclude = ! Is::accessible( $options['which_users'], $options['roles'], 'widget' );

					$exclude = apply_filters( 'jp_cc_should_exclude_widget', $exclude, $options, $widget_id );

					// unset non-visible item
					if ( $exclude ) {
						unset( $widget_areas[ $widget_area ][ $position ] );
					}

				}
			}
		}

		return $widget_areas;
	}

}
