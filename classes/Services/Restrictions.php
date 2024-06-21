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
use function ContentControl\get_the_content_id;

defined( 'ABSPATH' ) || exit;

/**
 * Restrictions service.
 */
class Restrictions {

	/**
	 * Array of all restrictions sorted by priority.
	 *
	 * @var Restriction[]|null
	 */
	public $restrictions;

	/**
	 * Array of all restrictions by ID.
	 *
	 * @var array<int,Restriction>|null
	 */
	public $restrictions_by_id;

	/**
	 * Simple internal request based cache.
	 *
	 * @var array<int,array<string,Restriction[]|false>>
	 */
	public $restriction_matches_cache = [];

	/**
	 * Initialize the service.
	 *
	 * @since 2.4.0
	 */
	public function __construct() {
		// Load restrictions.
		$this->get_restrictions();

		// Fire action to dependent services to initialize.
		do_action( 'content_control/services/restrictions/init', $this );
	}

	/**
	 * Get a list of all restrictions sorted by priority.
	 *
	 * @return array<int,Restriction>
	 */
	public function get_restrictions() {
		if ( ! isset( $this->restrictions ) ) {
			// Passively check for old restrictions, load them if found.
			if ( \ContentControl\get_data_version( 'restrictions' ) === 1 ) {
				$old_restrictions = \ContentControl\get_v1_restrictions();

				if ( false !== $old_restrictions ) {
					foreach ( $old_restrictions as $key => $restriction ) {
						$restriction['id']                = (int) $key;
						$this->restrictions_by_id[ $key ] = new Restriction( $restriction );
					}
				}
			}

			// This should run safely if no v1 rules are found, or if they don't exist.
			if ( empty( $this->restrictions_by_id ) ) {
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

				// Store the restrictions by ID for quick lookups.
				foreach ( $restrictions as $restriction ) {
					$this->restrictions_by_id[ $restriction->ID ] = new Restriction( $restriction );
				}
			}

			// Sort by priority.
			$this->restrictions = $this->sort_restrictions_by_priority( $this->restrictions_by_id ?? [] );
		}

		return $this->restrictions;
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

		// If we don't have restrictions, get them.
		if ( ! isset( $this->restrictions ) ) {
			$this->get_restrictions();
		}

		// If restriction is an ID, get the object.
		if ( is_numeric( $restriction ) && isset( $this->restrictions_by_id[ $restriction ] ) ) {
			return $this->restrictions_by_id[ $restriction ];
		}

		// If restriction is a slug, get the object.
		if ( is_string( $restriction ) ) {
			// Check if string is a slug or title.
			$slug = sanitize_title( $restriction );

			if ( $slug === $restriction ) {
				foreach ( $this->restrictions as $restriction_obj ) {
					if ( $restriction_obj->slug === $restriction ) {
						return $restriction_obj;
					}
				}
			}

			// Check if string is a title.
			foreach ( $this->restrictions as $restriction_obj ) {
				if ( $restriction_obj->title === $restriction ) {
					return $restriction_obj;
				}
			}
		}

		return null;
	}

	/**
	 * Get applicable restrictions for the given content.
	 *
	 * If $single is true, return the first applicable restriction. If false, return all applicable restrictions.
	 * Sorted by priority and cached internally.
	 *
	 * @param int|null $content_id Content ID.
	 * @param bool     $single     Whether to return a single match or an array of matches.
	 *
	 * @return Restriction|Restriction[]|false
	 */
	public function get_applicable_restrictions( $content_id = null, $single = true ) {
		// Check if we have a match in memory.
		$matches = $this->get_restriction_matches_from_cache( $content_id, $single );

		if ( is_null( $matches ) ) {
			$matches      = [];
			$restrictions = $this->get_restrictions();

			if ( ! empty( $restrictions ) ) {
				foreach ( $restrictions as $restriction ) {
					if ( $restriction->check_rules() ) {
						$matches[] = $restriction;
						if ( $single ) {
							break;
						}
					}
				}
			}

			// If no matches, return false.
			if ( empty( $matches ) ) {
				$matches = false;
			}

			// Cache the matches.
			$this->set_restriction_matches_in_cache( $content_id, $matches, $single );
		}

		if ( $single ) {
			return $matches[0] ?? false;
		}

		return ! empty( $matches ) ? $matches : false;
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
		return false !== $this->get_applicable_restrictions( $post_id, true );
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

	/**
	 * Generate cache key for restrictions.
	 *
	 * @param int|null $content_id Content ID.
	 *
	 * @return string
	 */
	public function generate_restriction_matches_cache_key( $content_id ) {
		$context    = current_query_context();
		$content_id = $content_id ?? get_the_content_id();

		if ( strpos( $context, 'posts' ) !== false ) {
			$cache_key = "post-{$content_id}";
		} elseif ( strpos( $context, 'terms' ) !== false ) {
			$cache_key = "term-{$content_id}";
		} elseif ( 'main' === $context || 'restapi' === $context ) {
			try {
				$query      = get_query();
				$hash_vars  = deep_clean_array( $query->query_vars ?? [] );
				$query_hash = md5( maybe_serialize( $hash_vars ) );
			} catch ( \Exception $e ) {
				$query_hash = md5( (string) wp_rand( 0, 100000 ) );
				plugin( 'logging' )->log_unique( 'ERROR: ' . $e->getMessage() );
			}

			// Append query hash to cache key to allow persisting across requests.
			$cache_key = "{$context}_{$query_hash}";

			if ( $content_id ) {
				$cache_key .= "_post-{$content_id}";
			}
		} else {
			$cache_key = "unknown-{$context}";
		}

		/**
		 * Filter the cache key.
		 *
		 * @param string $cache_key Cache key.
		 * @param string $context Context.
		 * @param int|null $content_id Content ID.
		 *
		 * @return string
		 *
		 * @since 2.4.0
		 */
		return apply_filters( 'content_control/generate_restriction_matches_cache_key', $cache_key, $context, $content_id );
	}

	/**
	 * Prime restriction matches cache.
	 *
	 * @param array<int,array<string,Restriction[]|false>> $restriction_matches_cache Restriction matches cache.
	 *
	 * @return void
	 *
	 * @since 2.4.0
	 */
	public function prime_restriction_matches_cache( $restriction_matches_cache = null ) {
		$this->restriction_matches_cache = $restriction_matches_cache ?? $this->restriction_matches_cache;
	}

	/**
	 * Get matches from cache.
	 *
	 * @param int|null $content_id Content ID.
	 * @param bool     $single    Whether to return a single match or an array of matches.
	 *
	 * @return Restriction[]|false|null
	 */
	public function get_restriction_matches_from_cache( $content_id = null, $single = true ) {
		// Get cache key.
		$cache_key = $this->generate_restriction_matches_cache_key( $content_id );

		/**
		 * Restrictions that match the content ID.
		 *
		 * @var Restriction[]|false|null Restriction cache for the given content ID.
		 */
		$matches = $this->restriction_matches_cache[ $single ][ $cache_key ] ?? null;

		// If no match for single, fallback on non-single and return that instead.
		if ( $single && is_null( $matches ) && isset( $this->restriction_matches_cache[ false ][ $cache_key ] ) ) {
			$matches = $this->restriction_matches_cache[ false ][ $cache_key ];
		}

		if ( is_null( $matches ) ) {
			/**
			 * Allow loading from persistent cache.
			 *
			 * @param Restriction[]|false|null $matches Restriction cache for the given content ID.
			 * @param string                   $cache_key Cache key.
			 * @param int|null                 $content_id Content ID.
			 * @param Restrictions             $restriction_service Restrictions instance.
			 *
			 * @return Restriction[]|false|null
			 *
			 * @since 2.4.0
			 */
			$matches = apply_filters( 'content_control/get_restriction_matches_from_cache', null, $cache_key . ( $single ? '--single' : '' ), $content_id, $this );

			// If we have a match, store it in memory rather than reaching out to object DB again.
			if ( ! is_null( $matches ) ) {
				$this->restriction_matches_cache[ $single ][ $cache_key ] = $matches;
			}
		}

		return $matches;
	}

	/**
	 * Set in cache for matches.
	 *
	 * @param int|null            $content_id Content ID.
	 * @param Restriction[]|false $matches Value to set.
	 * @param bool                $single    Whether to return a single match or an array of matches.
	 *
	 * @return void
	 */
	public function set_restriction_matches_in_cache( $content_id = null, $matches = false, $single = true ) {
		// Get cache key.
		$cache_key = $this->generate_restriction_matches_cache_key( $content_id );

		// Store the matches in memory for the remainder of the request.
		$this->restriction_matches_cache[ $single ][ $cache_key ] = $matches;

		/**
		 * Allow persisting to cache.
		 *
		 * @param string                $cache_key Cache key.
		 * @param Restriction[]|false   $matches Value to set.
		 * @param int|null              $content_id Content ID.
		 * @param Restrictions          $restriction_service Restrictions instance.
		 *
		 * @return void
		 *
		 * @since 2.4.0
		 */
		do_action( 'content_control/set_restriction_matches_in_cache', $cache_key . ( $single ? '--single' : '' ), $matches, $content_id, $this );
	}
}
