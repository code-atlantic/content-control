<?php
/**
 * Frontend feed setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Frontend;

use function ContentControl\get_plugin_option;

defined( 'ABSPATH' ) || exit;

use ContentControl\Helpers;
use ContentControl\Widget;
use ContentControl\Is;


/**
 * Class ContentControl\Frontend\Widgets
 */
class Widgets {

	/**
	 * Initialize Widgets
	 */
	public function __construct() {
		add_action( 'sidebars_widgets', [ $this, 'exclude_widgets' ] );
	}

	/**
	 * Checks for and excludes widgets based on their chosen options.
	 *
	 * @param array $widget_areas An array of widget areas and their widgets.
	 *
	 * @return array The modified $widget_area array.
	 */
	public function exclude_widgets( $widget_areas ) {
		if ( is_admin() || Helpers::is_customize_preview() ) {
			return $widget_areas;
		}

		foreach ( $widget_areas as $widget_area => $widgets ) {
			if ( ! empty( $widgets ) && 'wp_inactive_widgets' != $widget_area ) {
				foreach ( $widgets as $position => $widget_id ) {
					$options = \ContentControl\Widget::get_options( $widget_id );

					// If not accessible then exclude this item.
					$exclude = ! \ContentControl\Is::accessible( $options['which_users'], $options['roles'], 'widget' );

					$exclude = apply_filters( 'content_control_should_exclude_widget', $exclude, $options, $widget_id );

					// unset non-visible item.
					if ( $exclude ) {
						unset( $widget_areas[ $widget_area ][ $position ] );
					}
				}
			}
		}

		return $widget_areas;
	}

}
