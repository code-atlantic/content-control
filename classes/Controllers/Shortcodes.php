<?php
/**
 * Shortcode setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;

use function ContentControl\user_meets_requirements;

defined( 'ABSPATH' ) || exit;

/**
 * Class Shortcodes
 *
 * @package ContentControl
 */
class Shortcodes extends Controller {

	/**
	 * Initialize Widgets
	 */
	public function init() {
		add_shortcode( 'content_control', [ $this, 'content_control' ] );
	}

	/**
	 * Process the [content_control] shortcode.
	 *
	 * @param array<string,string|int|null> $atts Array or shortcode attributes.
	 * @param string                        $content Content inside shortcode.
	 *
	 * @return string
	 */
	public function content_control( $atts, $content = '' ) {
		// Deprecated.
		$deprecated_atts = shortcode_atts( [
			'logged_out' => null, // @deprecated 2.0.
			'roles'      => null, // @deprecated 2.0.
		], $atts );

		$atts = shortcode_atts( [
			'status'         => 'logged_in', // 'logged_in' or 'logged_out
			'allowed_roles'  => null,
			'excluded_roles' => null,
			'class'          => '',
			'message'        => $this->container->get_option( 'defaultDenialMessage', '' ),
		], $this->normalize_empty_atts( $atts ), 'content_control' );

		// Handle old args.
		if ( isset( $deprecated_atts['logged_out'] ) ) {
			$atts['status'] = (bool) $deprecated_atts['logged_out'] ? 'logged_out' : 'logged_in';
		}

		if ( isset( $deprecated_atts['roles'] ) && ! empty( $deprecated_atts['roles'] ) ) {
			$atts['allowed_roles'] = $deprecated_atts['roles'];
		}

		$user_roles = [];
		$match_type = 'any';

		// Normalize args.
		if ( ! empty( $atts['excluded_roles'] ) ) {
			$user_roles = $atts['excluded_roles'];
			$match_type = 'exclude';
		} elseif ( ! empty( $atts['allowed_roles'] ) ) {
			$user_roles = $atts['allowed_roles'];
			$match_type = 'match';
		}

		// Convert classes to array.
		$classes = ! empty( $atts['class'] ) ? explode( ' ', $atts['class'] ) : [];

		$classes[] = 'content-control-container';
		// @deprecated 2.0.0
		$classes[] = 'jp-cc';

		if ( user_meets_requirements( $atts['status'], $user_roles, $match_type ) ) {
			$classes[] = 'content-control-accessible';
			// @deprecated 2.0.0
			$classes[] = 'jp-cc-accessible';
			$container = '<div class="%1$s">%2$s</div>';
		} else {
			$classes[] = 'content-control-not-accessible';
			// @deprecated 2.0.0
			$classes[] = 'jp-cc-not-accessible';
			$container = '<div class="%1$s">%3$s</div>';
		}

		$classes = implode( ' ', $classes );

		return sprintf( $container, esc_attr( $classes ), do_shortcode( $content ), do_shortcode( $atts['message'] ) );
	}

	/**
	 * Takes set but empty attributes and sets them to true.
	 *
	 * These are typically valueless boolean attributes.
	 *
	 * @param array<string|int,string|int|null> $atts Array of shortcode attributes.
	 *
	 * @return (int|null|string|true)[]
	 *
	 * @psalm-return array<int|string, int|null|string|true>
	 */
	public function normalize_empty_atts( $atts = [] ) {
		if ( ! is_array( $atts ) || empty( $atts ) ) {
			$atts = [];
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
