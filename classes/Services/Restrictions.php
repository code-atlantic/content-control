<?php
/**
 * Frontend feed setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Services;

use ContentControl\Models\Restriction;

use function ContentControl\plugin;
use function ContentControl\get_query;
use function ContentControl\current_query_context;
use function ContentControl\deep_clean_array;

defined( 'ABSPATH' ) || exit;

/**
 * Restrictions service.
 */
class Restrictions {

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
				$old_restrictions = \ContentControl\get_v1_restrictions();

				if ( false !== $old_restrictions ) {
					foreach ( $old_restrictions as $key => $restriction ) {
						$restriction['id']        = (int) $key;
						$all_restrictions[ $key ] = new Restriction( $restriction );
					}
				}
			}

			// This should run safely if no v1 rules are found, or if they don't exist.
			if ( empty( $all_restrictions ) ) {
				// Query restriction post type.
				$restrictions = get_posts(
					[
						'post_type'      => 'cc_restriction',
						'posts_per_page' => -1,
						'post_status'    => 'publish',
						// Order by menu order.
						'orderby'        => [
							'menu_order'    => 'ASC',
							'post_modified' => 'DESC',
						],
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
	 * @return Restriction|null
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

		return null;
	}

	/**
	 * Get cache key for restrictions.
	 *
	 * @param int|null $post_id Post ID.
	 *
	 * @return string
	 */
	public function get_cache_key( $post_id = null ) {
		$query   = get_query();
		$context = current_query_context();

		try {
			$hash_vars = deep_clean_array( $query->query_vars );

			$query_hash = md5( maybe_serialize( $hash_vars ) );
		} catch ( \Exception $e ) {
			$query_hash = md5( (string) wp_rand( 0, 100000 ) );
			plugin( 'logging' )->log_unique( 'ERROR: ' . $e->getMessage() );
		}

		if ( is_null( $post_id ) ) {
			$post_id = \get_the_ID();
		}

		switch ( $context ) {
			case 'main':
				$cache_key = 'main';
				break;

			case 'main/posts':
			case 'posts':
				$cache_key = 'post-' . $post_id;
				break;

			default:
				$cache_key = $context . '_' . $query_hash . ( $post_id ? ( '_post-' . $post_id ) : '' );
				break;
		}

		return $cache_key;
	}

	/**
	 * Get all applicable restrictions for the current post.
	 *
	 * Careful, this could be very unperformant if you have a lot of restrictions.
	 *
	 * @param int|null $post_id Post ID.
	 *
	 * @return Restriction[]
	 */
	public function get_all_applicable_restrictions( $post_id = null ) {
		static $cache = [];
		$cache_key    = $this->get_cache_key( $post_id );

		if ( isset( $cache[ $cache_key ] ) ) {
			return $cache[ $cache_key ];
		}

		$restrictions = $this->get_restrictions();

		if ( ! empty( $restrictions ) ) {
			foreach ( $restrictions as $key => $restriction ) {
				if ( ! $restriction->check_rules() ) {
					unset( $restrictions[ $key ] );
				}
			}
		}

		$cache[ $cache_key ] = $restrictions;

		return $restrictions;
	}

	/**
	 * Get the first applicable restriction for the current post.
	 *
	 * Performant version that breaks on first applicable restriction. Sorted by priority.
	 * cached internally.
	 *
	 * @param int|null $post_id Post ID.
	 *
	 * @return Restriction|false
	 */
	public function get_applicable_restriction( $post_id = null ) {
		static $cache = [];
		$cache_key    = $this->get_cache_key( $post_id );

		if ( isset( $cache[ $cache_key ] ) ) {
			return $cache[ $cache_key ];
		}

		$cache[ $cache_key ] = false;

		$restrictions = $this->get_restrictions();

		$restrictions = $this->sort_restrictions_by_priority( $restrictions );

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
	 * @param int|null $post_id Post ID.
	 *
	 * @return boolean
	 */
	public function has_applicable_restrictions( $post_id = null ) {
		return false !== $this->get_applicable_restriction( $post_id );
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

		if ( null === $restriction ) {
			return false;
		}

		static $cache = [];
		$cache_key    = $restriction->id;

		// Check cache.
		if ( isset( $cache[ $cache_key ] ) ) {
			return $cache[ $cache_key ];
		}

		$user_meets_requirements = $restriction->user_meets_requirements();

		// Cache result.
		$cache[ $cache_key ] = $user_meets_requirements;

		return $user_meets_requirements;
	}

	/**
	 * Sort restrictions based on post sort order.
	 *
	 * MOVE to restrictions file.
	 *
	 * @param \ContentControl\Models\Restriction[] $restrictions Restrictions.
	 *
	 * @return \ContentControl\Models\Restriction[]
	 */
	public function sort_restrictions_by_priority( $restrictions ) {
		usort( $restrictions, function ( $a, $b ) {
			return $a->priority - $b->priority;
		});

		return $restrictions;
	}
}
