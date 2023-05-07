<?php
/**
 * Frontend feed setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Services;

use \ContentControl\Models\Restriction;

use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Restrictions service.
 */
class Restrictions {

	/**
	 * Array of post IDs that have been checked and the results.
	 *
	 * [restriction_id] => [
	 *      [post_id] => true|false
	 * ]
	 *
	 * @var array
	 */
	public $check_caches = [];

	/**
	 * Get a list of all restrictions.
	 *
	 * @return Restriction[]
	 */
	public function get_restrictions() {
		static $all_restrictions;

		if ( ! isset( $all_restrictions ) ) {
			$all_restrictions = [];

			// Query restriction post type.
			$restrictions = get_posts(
				[
					'post_type'      => 'cc_restriction',
					'posts_per_page' => -1,
					'post_status'    => 'publish',
					// Order by menu order.
					'orderby'        => [ 'menu_order', 'date' ],
					'order'          => 'DESC',
				]
			);

			foreach ( $restrictions as $restriction ) {
				$all_restrictions[ $restriction->ID ] = new Restriction( $restriction );
			}
		}

		return $all_restrictions;
	}

	/**
	 * Get restriction, by ID, slug or object.
	 *
	 * @param int|string|Restriction $restriction Restriction ID, slug or object.
	 *
	 * @return Restriction|false
	 */
	public function get_restriction( $restriction ) {

		// If restriction is already an object, return it.
		if ( is_object( $restriction ) && isset( $restriction->id ) ) {
			return $restriction;
		}

		$restrictions = $this->get_restrictions();

		// If restriction is an ID, get the object.
		if ( is_numeric( $restriction ) && isset( $restrictions[ $restriction ] ) ) {
			return $restrictions[ $restriction ];
		}

		// If restriction is a slug, get the object.
		if ( is_string( $restriction ) ) {
			// Check if string is a slug or title.
			$slug = sanitize_title( $restriction );

			if ( $slug === $restriction ) {
				foreach ( $restrictions as $restriction_obj ) {
					if ( $restriction_obj->slug === $restriction ) {
						return $restriction_obj;
					}
				}
			}

			// Check if string is a title.
			foreach ( $restrictions as $restriction_obj ) {
				if ( $restriction_obj->title === $restriction ) {
					return $restriction_obj;
				}
			}
		}

		return false;
	}


	/**
	 * Check if restriction applies to current user.
	 *
	 * @param int|string|Restriction $restriction Restriction ID, slug or object.
	 * @param string                 $context     Context to check restriction against.
	 * @return boolean
	 */
	public function does_restriction_apply_to_user( $restriction, $context ) {
		// Get restriction object.
		$restriction = $this->get_restriction( $restriction );

		$restriction_applies = false !== $restriction ?
				$restriction->applies_to_current_user( $context ) :
				false;

		return apply_filters(
			'content_control_restriction_applies_to_user',
			$restriction_applies,
			$restriction,
			$context
		);
	}

	/**
	 * Check if given post is restricted by given restriction.
	 *
	 * @param Restriction|int|string $restriction_id Restriction.
	 * @param string                 $context     Context to check restriction against.
	 * @param int                    $post_id     Post ID.
	 *
	 * @return boolean
	 */
	public function is_restriction_applicable( $restriction_id, $context, $post_id = null ) {
		global $post;

		$restriction = $this->get_restriction( $restriction_id );

		if ( ! $restriction ) {
			return false;
		}

		if ( $post_id > 0 ) {
			// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			$post = get_post( $post_id );
			setup_postdata( $post );
		}

		$restriction_applies = $restriction->check_rules();

		if ( $post_id > 0 ) {
			// Reset global post object.
			wp_reset_postdata();
		}

		return apply_filters(
			'content_control_restriction_applies_to_user',
			$restriction_applies,
			$restriction,
			$context,
			$post_id
		);
	}

	/**
	 * Get all applicable restrictions for the current post.
	 *
	 * @param int|null $post_id Post ID.
	 * @return array
	 */
	public function get_applicable_restrictions( $post_id = null ) {
		$restrictions = $this->get_restrictions();

		if ( ! empty( $restrictions ) ) {
			$restrictions = array_filter(
				$restrictions,
				function( $restriction ) use ( $post_id ) {
					return $this->is_restriction_applicable( $restriction, $post_id );
				}
			);
		}

		return $restrictions;
	}

	/**
	 * Check if post has applicable restrictions.
	 *
	 * @param int|null $post_id Post ID.
	 * @return boolean
	 */
	public function has_applicable_restrictions( $post_id = null ) {
		$restrictions = $this->get_applicable_restrictions( $post_id );

		return ! empty( $restrictions );
	}

	public function get_restricted_content( $restriction ) {
		// TODO FILL THIS IN< BUT FIRST ADD Restriction model class for each instance.
		// REFACTOR AS NEEDED
		// TODO LEFT OFF HERE!!@
	}




	/**
	 * Protected post array
	 *
	 * @var array
	 */
	public $protected_posts = [];

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
			if ( $this->is_restriction_applicable( $restriction ) ) {
				if ( $this->does_restriction_apply_to_user( $restriction ) ) {
					$restriced_content = $restriction;
				}
				break;
			}
		}

		return $restriced_content;
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

}
