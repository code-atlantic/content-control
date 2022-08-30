<?php
/**
 * Frontend feed setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Frontend;

use ContentControl\Options;
use ContentControl\Conditions;
use ContentControl\Is;

defined( 'ABSPATH' ) || exit;

/**
 * Frontend restriction controller.
 */
class Restrictions {

	/**
	 * Protected post array
	 *
	 * @var array
	 */
	public $protected_posts = [];

	/**
	 *  Temporary til this gets rewritten.
	 *
	 * @var \ContentControl\Frontend\Restrictions
	 */
	public static $instance;

	/** Fetch a static instance. */
	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Initiate functionality.
	 */
	public function init() {
		if ( \ContentControl\is_rest() ) {
			return;
		}

		add_action( 'template_redirect', [ $this, 'template_redirect' ] );
	}

	/**
	 * Get rules for a specific post ID.
	 *
	 * @param int $post_id Post ID.
	 * @return array|false;
	 */
	public function get_rules( $post_id ) {
		return isset( $this->protected_posts[ $post_id ] ) ? $this->protected_posts[ $post_id ] : false;
	}

	/**
	 * Check if content protected by redirect.
	 */
	public function template_redirect() {
		global $post;

		$restriction = $this->restricted_content();

		if ( ! $restriction ) {
			return;
		}

		// Cache the post if restricted.
		if ( is_singular() && ! is_archive() ) {
			$this->protected_posts[ $post->ID ] = $restriction;
		}

		if ( 'redirect' === $restriction['protection_method'] ) {
			$this->redirect( $restriction );
		}
	}

	/**
	 * Get restricted content.
	 *
	 * @return array|false
	 */
	public function restricted_content() {
		$restrictions = \ContentControl\get_option( 'restrictions' );

		$restriced_content = false;

		if ( ! $restrictions || empty( $restrictions ) ) {
			return $restriced_content;
		}

		foreach ( $restrictions as $restriction ) {
			if ( $this->content_match( $restriction ) ) {
				$roles = ! empty( $restriction['roles'] ) ? $restriction['roles'] : [];

				if ( Is::access_blocked( $restriction['who'], $roles, [ 'context' => 'content_restrictions' ] ) ) {
					$restriced_content = $restriction;
				}
				break;
			}
		}

		return $restriced_content;
	}

	/**
	 * Handle redirect for given restriction.
	 *
	 * @param array $restriction Array of restriction settings.
	 */
	public function redirect( $restriction ) {
		if ( empty( $restriction['redirect_type'] ) ) {
			return;
		}

		$redirect = false;

		switch ( $restriction['redirect_type'] ) {
			case 'login':
				$redirect = wp_login_url( $this->current_url() );
				break;

			case 'home':
				$redirect = home_url();
				break;

			case 'custom':
				$redirect = $restriction['redirect_url'];
				break;

			default:
				// Do not redirect if not one of our values.
		}

		if ( $redirect ) {
			wp_safe_redirect( $redirect );
			exit;
		}
	}

	/**
	 * Check restriction content match
	 *
	 * @param array $restriction Array of restriction settings.
	 * @return bool
	 */
	public function content_match( $restriction ) {
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
				if ( ! isset( $condition['not_operand'] ) ) {
					$condition['not_operand'] = false;
				}

				$match = ( ! $condition['not_operand'] && $this->check_condition( $condition ) ) || ( $condition['not_operand'] && ! $this->check_condition( $condition ) );

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
	 * Get current url.
	 *
	 * @return string
	 */
	public function current_url() {
		/* phpcs:disable  WordPress.Security.ValidatedSanitizedInput.InputNotValidated */
		$protocol = ( ! empty( $_SERVER['HTTPS'] ) && 'off' !== $_SERVER['HTTPS'] ) || 443 === $_SERVER['SERVER_PORT'] ? 'https://' : 'http://';

		return $protocol . sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] ) );
		/* phpcs:enable  WordPress.Security.ValidatedSanitizedInput.InputNotValidated */
	}

	/**
	 * Check if content match condition is true.
	 *
	 * @param array $settings Array of condition settings.
	 * @return bool
	 */
	public function check_condition( $settings = [] ) {
		$condition = Conditions::instance()->get_condition( $settings['target'] );

		if ( ! $condition ) {
			return false;
		}

		return call_user_func( $condition['callback'], $settings );
	}

}
