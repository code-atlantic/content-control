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
	 * @var array<string,Restriction[]>
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
		$context = current_query_context();

		// Ensure user ID is accounted for.
		$user_id = get_current_user_id();

		// Set post ID if not provided. Likely a main query.
		if ( is_null( $post_id ) ) {
			$post_id = get_the_ID();
		}

		switch ( $context ) {
			case 'main/posts':
			case 'restapi/posts':
			case 'posts':
				$cache_key = "post-{$post_id}";
				break;

			case 'main/terms':
			case 'restapi/terms':
			case 'terms':
				$cache_key = "term-{$post_id}";
				break;

			case 'main':
			default:
				try {
					$query      = get_query();
					$hash_vars  = deep_clean_array( $query->query_vars ?? [] );
					$query_hash = md5( maybe_serialize( $hash_vars ) );
				} catch ( \Exception $e ) {
					$query_hash = md5( (string) wp_rand( 0, 100000 ) );
					plugin( 'logging' )->log_unique( 'ERROR: ' . $e->getMessage() );
				}

				$cache_key = "main_{$query_hash}";

				if ( ! is_null( $post_id ) ) {
					$cache_key .= "_post-{$post_id}";
				}
				break;
		}

		// Add user ID to cache key. Those without will be for logged out users.
		if ( $user_id > 0 ) {
			$cache_key .= "_user-{$user_id}";
		}

		/**
		 * Filter the cache key.
		 *
		 * @param string $cache_key Cache key.
		 * @param int|null $post_id Post ID.
		 * @param int|null $user_id User ID.
		 * @param string $context Context.
		 *
		 * @return string
		 *
		 * @since 2.4.0
		 */
		return apply_filters( 'content_control/get_cache_key', $cache_key, $post_id, $user_id, $context );
	}

	/**
	 * Get from cache.
	 *
	 * @param string $cache_key Cache key.
	 *
	 * @return mixed|null
	 */
	public function get_from_cache( $cache_key ) {
		/**
		 * Allow preloading from cache.
		 *
		 * @param mixed|null $cache Cache.
		 * @param string $cache_key Cache key.
		 * @param Restrictions $this Restrictions instance.
		 *
		 * @return mixed|null
		 *
		 * @since 2.4.0
		 */
		$cache = apply_filters( 'content_control/get_restrictions_from_cache', null, $cache_key, $this );

		if ( $cache ) {
			return $cache;
		}

		return $this->restrictions_cache[ $cache_key ] ?? null;
	}

	/**
	 * Set in cache.
	 *
	 * @param string $cache_key Cache key.
	 * @param mixed  $value Value to set.
	 *
	 * @return void
	 */
	public function set_in_cache( $cache_key, $value ) {
		$this->restrictions_cache[ $cache_key ] = $value;

		/**
		 * Filter the cache.
		 *
		 * @param array<string,mixed> $cache Cache.
		 * @param string $cache_key Cache key.
		 * @param Restrictions $this Restrictions instance.
		 *
		 * @return array<string,mixed>
		 *
		 * @since 2.4.0
		 */
		do_action( 'content_control/set_restrictions_in_cache', $cache_key, $value, $this );
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
		if ( $single && is_null( $matches ) && isset( $this->restriction_matches_cache[ ! $single ][ $cache_key ] ) ) {
			$matches = $this->restriction_matches_cache[ ! $single ][ $cache_key ] ?? null;
		}

		if ( is_null( $matches ) ) {
			/**
			 * Allow loading from persistent cache.
			 *
			 * @param Restriction[]|false|null $matches Restriction cache for the given content ID.
			 * @param string                   $cache_key Cache key.
			 * @param Restrictions             $restriction_service Restrictions instance.
			 *
			 * @return Restriction[]|false|null
			 *
			 * @since 2.4.0
			 */
			$matches = apply_filters( 'content_control/get_restriction_matches_from_cache', null, $cache_key . ( $single ? '--single' : '' ), $this, $content_id );

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
	 * @param int|null                        $content_id Content ID.
	 * @param Restriction|Restriction[]|false $matches Value to set.
	 * @param bool                            $single    Whether to return a single match or an array of matches.
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
		 * @param int|null      $content_id Content ID.
		 * @param array<int|null,Restriction|Restriction[]|false> $matches Value to set.
		 * @param bool          $single Whether to return a single match or an array of matches.
		 * @param Restrictions  $restriction_service Restrictions instance.
		 *
		 * @return void
		 *
		 * @since 2.4.0
		 *
		 * @return array<string,mixed>
		 *
		 * @since 2.4.0
		 */
		do_action( 'content_control/set_restriction_matches_in_cache', $cache_key . ( $single ? '--single' : '' ), $matches, $this );
	}
}
