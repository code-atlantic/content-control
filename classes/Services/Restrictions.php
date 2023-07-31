<?php
/**
 * Frontend feed setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Services;

use ContentControl\Models\Restriction;

use function ContentControl\sort_restrictions_by_priority;

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

			if ( \ContentControl\get_data_version( 'restrictions' ) === 1 ) {
				$restrictions = \ContentControl\get_v1_restrictions();

				foreach ( $restrictions as $key => $restriction ) {
					$restriction['id']        = $key;
					$all_restrictions[ $key ] = new Restriction( $restriction );
				}
			} else {
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
		if ( $restriction instanceof Restriction ) {
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
	 * cached internally.
	 *
	 * @return Restriction|false
	 */
	public function get_applicable_restriction() {
		global $wp_query;
		// TODO Review if this is the best way to cache this. Might be using global query every time, even in the loop.
		static $cache = [];

		// Generate cache key from hasing $wp_query.
		$cache_key = md5( wp_json_encode( $wp_query ) );

		if ( isset( $cache[ $cache_key ] ) ) {
			return $cache[ $cache_key ];
		}

		$cache[ $cache_key ] = false;

		$restrictions = $this->get_restrictions();

		$restrictions = sort_restrictions_by_priority( $restrictions );

		if ( ! empty( $restrictions ) ) {
			foreach ( $restrictions as $restriction ) {
				if ( $restriction->check_rules() ) {
					$cache[ $cache_key ] = $restriction;
					break;
				}
			}
		}

		return $cache[ $cache_key ];
	}

	/**
	 * Check if post has applicable restrictions.
	 *
	 * Cached via get_applicable_restriction().
	 *
	 * @return boolean
	 */
	public function has_applicable_restrictions() {
		return false !== $this->get_applicable_restriction();
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

		if ( false === $restriction ) {
			return false;
		}

		static $cache = [];
		$cache_key    = $restriction->id;

		// Check cache.
		if ( isset( $cache[ $cache_key ] ) ) {
			return $cache[ $cache_key ];
		}

		// Check if user meets requirements.
		$cache[ $cache_key ] = $restriction->user_meets_requirements();

		return $cache[ $cache_key ];
	}
}
