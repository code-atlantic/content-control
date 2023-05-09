<?php
/**
 * Frontend feed setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Services;

use \ContentControl\Models\Restriction;
use \ContentControl\Models\RuleEngine\Query;

use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Restrictions service.
 */
class Restrictions {

	/**
	 * Cache to prevent rechechs & queries.
	 *
	 * @var array
	 */
	private $cache = [];

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
	 * Get all applicable restrictions for the current post.
	 *
	 * Careful, this could be very unperformant if you have a lot of restrictions.
	 *
	 * @return array
	 */
	public function get_all_applicable_restrictions() {
		$restrictions = $this->get_restrictions();

		if ( ! empty( $restrictions ) ) {
			foreach ( $restrictions as $key => $restriction ) {
				if ( ! $restriction->check_rules() ) {
					unset( $restrictions[ $key ] );
				}
			}
		}

		return $restrictions;
	}

	/**
	 * Get the first applicable restriction for the current post.
	 *
	 * Performant version that breaks on first applicable restriction. Sorted by priority.
	 *
	 * @return Restriction|false
	 */
	public function get_applicable_restriction() {
		$restrictions = $this->get_restrictions();

		// Cache the post if restricted.
		// if ( is_singular() && ! is_archive() ) {
			// $this->protected_posts[ $post->ID ] = $restriction;
		// }

		if ( ! empty( $restrictions ) ) {
			foreach ( $restrictions as $restriction ) {
				if ( $restriction->check_rules() ) {
					return $restriction;
				}
			}
		}

		return false;
	}

	/**
	 * Check if post has applicable restrictions.
	 *
	 * @return boolean
	 */
	public function has_applicable_restrictions() {
		return false !== $this->get_applicable_restriction();
	}

	/**
	 * Check restriction rules match the current post content.
	 *
	 * @param Restriction|int|string $restriction_id Restriction.
	 *
	 * @return boolean
	 */
	public function rules_match_the_content( $restriction_id ) {
		$restriction = $this->get_restriction( $restriction_id );

		return false === $restriction ? false : $restriction->check_rules();
	}

	/**
	 * Check if user meets requirements for given restriction.
	 *
	 * @param int|string|Restriction $restriction Restriction ID, slug or object.
	 *
	 * @return boolean
	 */
	public function user_meets_requirements( $restriction ) {
		$restriction = $this->get_restriction( $restriction );

		return false === $restriction ? false : $restriction->user_meets_requirements();
	}

}
