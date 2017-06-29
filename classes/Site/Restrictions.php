<?php


namespace JP\CC\Site;

use JP\CC\Options;
use JP\CC\Conditions;
use JP\CC\Is;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Restrictions {

	public static $protected_posts = array();

	public static function init() {
		add_action( 'template_redirect', array( __CLASS__, 'template_redirect' ) );
	}

	public static function get_rules( $post_id ) {
		return isset( static::$protected_posts[ $post_id ] ) ? static::$protected_posts[ $post_id ] : false;
	}

	public static function template_redirect() {
		global $post;

		$restriction = static::restricted_content();

		if ( ! $restriction ) {
			return;
		}

		// Cache the post if restricted.
		if ( is_singular() && ! is_archive()) {
			static::$protected_posts[ $post->ID ] = $restriction;
		}

		switch ( $restriction['protection_method'] ) {
			case 'redirect':
				static::redirect( $restriction );
				break;
		}
	}

	public static function restricted_content() {

		$restrictions = Options::get( 'restrictions' );

		$restriced_content = false;

		if ( ! $restrictions || empty( $restrictions ) ) {
			return $restriced_content;
		}

		foreach ( $restrictions as $restriction ) {
			if ( static::content_match( $restriction ) ) {
				$roles = ! empty( $restriction['roles'] ) ? $restriction['roles'] : array();

				if ( Is::access_blocked( $restriction['who'], $roles, array( 'context' => 'content_restrictions' ) ) ) {
					$restriced_content = $restriction;
				}
				break;
			}
		}

		return $restriced_content;
	}

	public static function redirect( $restriction ) {

		if ( empty( $restriction['redirect_type'] ) ) {
			return;
		}

		$redirect = false;

		switch ( $restriction['redirect_type'] ) {
			case 'login':
				$redirect = wp_login_url( static::current_url() );
				break;

			case 'home':
				$redirect = home_url();
				break;

			case 'custom':
				$redirect = $restriction['redirect_url'];
				break;
		}

		if ( $redirect ) {
			wp_redirect( $redirect );
			exit;
		}
	}

	public static function content_match( $restriction ) {

		$content_match = false;

		if ( empty( $restriction['conditions'] ) ) {
			return $content_match;
		}

		// All Groups Must Return True. Break if any is false and set $loadable to false.
		foreach ( $restriction['conditions'] as $group => $conditions ) {

			// Groups are false until a condition proves true.
			$group_check = false;

			// At least one group condition must be true. Break this loop if any condition is true.
			foreach ( $conditions as $condition ) {

				// The not operand value is missing, set it to false.
				if ( ! isset ( $condition['not_operand'] ) ) {
					$condition['not_operand'] = false;
				}

				$match = ( ! $condition['not_operand'] && static::check_condition( $condition ) ) || ( $condition['not_operand'] && ! static::check_condition( $condition ) );

				// If any condition passes, set $group_check true and break.
				if ( $match ) {
					$group_check = true;
					break;
				}

			}

			// If any group of conditions doesn't pass, popup is not loadable.
			if ( ! $group_check ) {
				$content_match = false;
				break;
			} else {
				$content_match = true;
			}

		}

		return $content_match;

	}

	/**
	 * @return string
	 */
	public static function current_url() {
		$protocol = ( ! empty( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] !== 'off' ) || $_SERVER['SERVER_PORT'] == 443 ? 'https://' : 'http://';

		return $protocol . $_SERVER['HTTP_HOST'] . $_SERVER["REQUEST_URI"];
	}

	public static function check_condition( $settings = array() ) {
		$condition = Conditions::instance()->get_condition( $settings['target'] );

		if ( ! $condition ) {
			return false;
		}

		return call_user_func( $condition['callback'], $settings );
	}

}
