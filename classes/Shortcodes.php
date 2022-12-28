<?php


namespace JP\CC;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Shortcodes
 * @package JP\CC
 */
class Shortcodes {

	/**
	 * Initialize Widgets
	 */
	public static function init() {
		add_shortcode( 'content_control', array( __CLASS__, 'content_control' ) );
	}

	/**
	 * Process the [content_control] shortcode.
	 *
	 * @param $atts
	 * @param string $content
	 *
	 * @return string
	 */
	public static function content_control( $atts, $content = '' ) {

		$atts = shortcode_atts( array(
			'logged_out' => null,
			'roles'      => array(),
			'class'      => '',
			'message'    => Options::get( 'default_denial_message' , '' ),
		), static::normalize_empty_atts( $atts ), 'content_control' );

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
	public static function normalize_empty_atts( $atts = array() ) {
		if ( ! is_array( $atts ) ) {
			if ( empty( $atts ) ) {
				$atts = array();
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
