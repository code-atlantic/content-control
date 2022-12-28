<?php
/**
 * Shortcode registration.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

/**
 * Class Shortcodes
 *
 * @package ContentControl
 */
class Shortcodes {

	/**
	 * Initialize Widgets
	 */
	public function __construct() {
		add_shortcode( 'content_control', [ $this, 'content_control' ] );
	}

	/**
	 * Process the [content_control] shortcode.
	 *
	 * @param array  $atts Array or shortcode attributes.
	 * @param string $content Content inside shortcode.
	 *
	 * @return string
	 */
	public function content_control( $atts, $content = '' ) {
		$atts = shortcode_atts( [
			'logged_out' => null,
			'roles'      => [],
			'class'      => '',
			'message'    => Options::get( 'default_denial_message', '' ),
		], $this->normalize_empty_atts( $atts ), 'content_control' );

		$who = isset( $atts['logged_out'] ) ? 'logged_out' : 'logged_in';

		$roles = ! is_array( $atts['roles'] ) ? explode( ',', $atts['roles'] ) : $atts['roles'];
		$roles = array_map( 'trim', $roles );

		$classes   = ! is_array( $atts['class'] ) ? explode( ' ', $atts['class'] ) : $atts['class'];
		$classes[] = 'jp-cc';

		if ( Is::accessible( $who, $roles, 'shortcode' ) ) {
			$classes[] = 'jp-cc-accessible';
			$container = '<div class="%1$s">%2$s</div>';
		} else {
			$classes[] = 'jp-cc-not-accessible';
			$container = '<div class="%1$s">%3$s</div>';
		}

		$classes = implode( ' ', $classes );

		return sprintf( $container, esc_attr( $classes ), do_shortcode( $content ), do_shortcode( $atts['message'] ) );
	}

	/**
	 * Takes empty attributes and sets them to true.
	 *
	 * @param array $atts
	 *
	 * @return mixed
	 */
	public function normalize_empty_atts( $atts = [] ) {
		if ( ! is_array( $atts ) ) {
			if ( empty( $atts ) ) {
				$atts = [];
			}
		}

		foreach ( $atts as $attribute => $value ) {
			if ( is_int( $attribute ) ) {
				$atts[ strtolower( $value ) ] = true;
				unset( $atts[ $attribute ] );
			}
		}

		return $atts;
	}

}
