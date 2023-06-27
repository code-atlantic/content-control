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
	 * @param array  $atts Array or shortcode attributes.
	 * @param string $content Content inside shortcode.
	 *
	 * @return string
	 */
	public function content_control( $atts, $content = '' ) {
		$atts = shortcode_atts( [
			'status'         => null, // 'logged_in' or 'logged_out
			'allowed_roles'  => null,
			'excluded_roles' => null,
			'class'          => '',
			'message'        => $this->container->get_option( 'defaultDenialMessage', '' ),
			// Deprecated.
			'logged_out'     => null, // @deprecated 2.0.0
			'roles'          => '', // @deprecated 2.0.0
		], $this->normalize_empty_atts( $atts ), 'content_control' );

		// Handle old args.
		if ( null === $atts['status'] && isset( $atts['logged_out]'] ) && (bool) $atts['logged_out'] ) {
			// @deprecated 2.0.0
			$atts['status'] = 'logged_out';
			unset( $atts['logged_out'] );
		}

		if ( isset( $atts['roles'] ) && ! empty( $atts['roles'] ) ) {
			// @deprecated 2.0.
			$atts['allowed_roles'] = $atts['roles'];
			unset( $atts['roles'] );
		}

		if ( isset( $atts['allowed_roles'] ) && ! is_array( $atts['allowed_roles'] ) ) {
			$atts['allowed_roles'] = explode( ',', $atts['allowed_roles'] );
		}

		if ( isset( $atts['excluded_roles'] ) && ! is_array( $atts['excluded_roles'] ) ) {
			$atts['excluded_roles'] = explode( ',', $atts['excluded_roles'] );
		}

		if ( is_array( $atts['excluded_roles'] ) && count( $atts['excluded_roles'] ) ) {
			$user_roles = array_map( 'trim', $atts['excluded_roles'] );
			$match_type = 'exclude';
		} elseif ( is_array( $atts['allowed_roles'] ) && count( $atts['allowed_roles'] ) ) {
			$user_roles = array_map( 'trim', $atts['allowed_roles'] );
			$match_type = 'match';
		} else {
			$user_roles = [];
			$match_type = 'any';
		}

		$user_status = $atts['status'];

		$classes = $atts['class'];

		if ( ! is_array( $classes ) ) {
			$classes = explode( ' ', $classes );
		}

		$classes[] = 'content-control-container';
		// @deprecated 2.0.0
		$classes[] = 'jp-cc';

		if ( user_meets_requirements( $user_status, $user_roles, $match_type ) ) {
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
	 * @param array $atts Array of shortcode attributes.
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
