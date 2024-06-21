<?php
/**
 * Restriction utility & helper functions.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl;

use ContentControl\Models\Restriction;

use function ContentControl\plugin;
use function ContentControl\set_rules_query;
use function ContentControl\is_rest;

defined( 'ABSPATH' ) || exit;

/**
 * Check if content has restrictions.
 *
 * @param int|null $content_id Content ID.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_has_restrictions( $content_id = null ) {
	$overload_content = setup_content_globals( $content_id );

	$has_restrictions = plugin( 'restrictions' )->has_applicable_restrictions( $content_id );

	// Clear content if we overloaded it.
	if ( $overload_content ) {
		reset_content_globals();
	}

	/**
	 * Filter whether content has restrictions.
	 *
	 * @param bool $has_restrictions Whether content has restrictions.
	 * @param int|null $content_id Content ID.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	return (bool) apply_filters( 'content_control/content_has_restrictions', $has_restrictions, $content_id );
}

/**
 * Check if user can access content.
 *
 * @param int|null $content_id Content ID.
 *
 * @return bool True if user meets requirements, false if not.
 *
 * @since 2.0.0
 */
function user_can_view_content( $content_id = null ) {
	if ( ! content_has_restrictions( $content_id ) ) {
		return true;
	}

	$can_view = true;

	$restrictions = [];

	if ( false === (bool) apply_filters( 'content_control/check_all_restrictions', false, $content_id ) ) {
		/**
		 * Fetch first applicable restriction.
		 *
		 * @var Restriction|false $restriction
		 */
		$restriction = get_applicable_restrictions( $content_id, true );

		if ( $restriction ) {
			$can_view       = $restriction->user_meets_requirements();
			$restrictions[] = $restriction;
		}
	} else {
		/**
		 * Fetch all applicable restrictions.
		 *
		 * @var Restriction[]|false $restrictions
		 */
		$restrictions = get_applicable_restrictions( $content_id, false );

		if ( count( $restrictions ) ) {
			$checks = [];

			foreach ( $restrictions as $restriction ) {
				$checks[] = $restriction->user_meets_requirements();
			}

			// When checking all, we are looking for any true value.
			$can_view = in_array( true, $checks, true );
		}
	}

	/**
	 * Filter whether user can view content.
	 *
	 * @param bool $can_view Whether user can view content.
	 * @param int|null $content_id Content ID.
	 * @param Restriction[] $restrictions Restrictions.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	return (bool) apply_filters( 'content_control/user_can_view_content', $can_view, $content_id, $restrictions );
}

/**
 * Helper that checks if given or current content is restricted or not.
 *
 * @see \ContentControl\user_can_view_content() to check if user can view content.
 *
 * @param int|null $content_id Content ID.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_restricted( $content_id = null ) {
	$is_restricted = ! user_can_view_content( $content_id );

	/**
	 * Filter whether content is restricted.
	 *
	 * @param bool $is_restricted Whether content is restricted.
	 * @param int|null $content_id Content ID.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	return (bool) apply_filters( 'content_control/content_is_restricted', $is_restricted, $content_id );
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
 *
 * @since 2.4.0
 */
function get_applicable_restrictions( $content_id = null, $single = true ) {
	$overload_content = setup_content_globals( $content_id );

	$restriction = plugin( 'restrictions' )->get_applicable_restrictions( $content_id, $single );

	// Clear content if we overloaded it.
	if ( $overload_content ) {
		reset_content_globals();
	}

	return $restriction;
}

/**
 * Get applicable restriction.
 *
 * @param int|null $content_id Content ID.
 *
 * @return Restriction|false
 *
 * @since 2.0.0
 */
function get_applicable_restriction( $content_id = null ) {
	return get_applicable_restrictions( $content_id, true );
}

/**
 * Get all applicable restrictions.
 *
 * @param int|null $content_id Content ID.
 *
 * @return Restriction[]
 *
 * @since 2.0.11
 */
function get_all_applicable_restrictions( $content_id = null ) {
	return get_applicable_restrictions( $content_id, false );
}

/**
 * Check if query has restrictions.
 *
 * @param \WP_Query $query Query object.
 *
 * @return array<array{restriction:Restriction,post_ids:int[]}>|false
 *
 * @since 2.0.0
 */
function get_restriction_matches_for_queried_posts( $query ) {
	// If its the main query, and not an archive-like page, bail.
	if ( $query->is_main_query() && ( ! $query->is_home() && ! $query->is_archive() && ! $query->is_search() ) ) {
		return false;
	}

	if ( empty( $query->posts ) ) {
		return false;
	}

	static $restrictions;

	// Generate cache key from hasing $wp_query.
	$cache_key = md5( (string) wp_json_encode( $query ) );

	if ( isset( $restrictions[ $cache_key ] ) ) {
		return $restrictions[ $cache_key ];
	}

	set_rules_query( $query );

	foreach ( $query->posts as $post ) {
		/**
		 * Post ID.
		 *
		 * @var \WP_Post $post
		 */
		if ( content_is_restricted( $post->ID ) ) {
			// TODO This needs to likely respect the filter for checking all applicable restrictions.
			$restriction = get_applicable_restriction( $post->ID );

			if ( ! $restriction ) {
				continue;
			}

			if ( ! isset( $restrictions[ $cache_key ][ $restriction->priority ] ) ) {
				// Handles deduplication & sorting.
				$restrictions[ $cache_key ][ $restriction->priority ] = [
					'restriction' => $restriction,
					'post_ids'    => [],
				];
			}

			// Add post to restriction.
			$restrictions[ $cache_key ][ $restriction->priority ]['post_ids'][] = $post->ID;
		}
	}

	set_rules_query( null );

	if ( empty( $restrictions[ $cache_key ] ) ) {
		$restrictions[ $cache_key ] = false;
	} else {
		// Sort by priority.
		ksort( $restrictions[ $cache_key ] );
		// Remove priority keys.
		$restrictions[ $cache_key ] = array_values( $restrictions[ $cache_key ] );
	}

	return $restrictions[ $cache_key ];
}

/**
 * Check if query has restrictions.
 *
 * @param \WP_Term_Query $query Query object.
 *
 * @return array<array{restriction:Restriction,term_ids:int[]}>|false
 *
 * @since 2.2.0
 */
function get_restriction_matches_for_queried_terms( $query ) {
	if ( empty( $query->terms ) ) {
		return false;
	}

	static $restrictions;

	// Generate cache key from hasing $wp_query.
	$cache_key = md5( (string) wp_json_encode( $query ) );

	if ( isset( $restrictions[ $cache_key ] ) ) {
		return $restrictions[ $cache_key ];
	}

	set_rules_query( $query );

	foreach ( $query->terms as $term ) {
		$term_id = false;

		if ( is_object( $term ) && isset( $term->term_id ) ) {
			$term_id = (int) $term->term_id;
		} elseif ( is_numeric( $term ) ) {
			$term_id = absint( $term );
		}

		if ( $term_id > 0 && content_is_restricted( $term_id ) ) {
			// TODO This needs to likely respect the filter for checking all applicable restrictions.
			$restriction = get_applicable_restrictions( $term_id, true );

			if ( ! $restriction ) {
				continue;
			}

			if ( ! isset( $restrictions[ $cache_key ][ $restriction->priority ] ) ) {
				// Handles deduplication & sorting.
				$restrictions[ $cache_key ][ $restriction->priority ] = [
					'restriction' => $restriction,
					'term_ids'    => [],
				];
			}

			// Add term to restriction.
			$restrictions[ $cache_key ][ $restriction->priority ]['term_ids'][] = $term_id;
		}
	}

	set_rules_query( null );

	if ( empty( $restrictions[ $cache_key ] ) ) {
		$restrictions[ $cache_key ] = false;
	} else {
		// Sort by priority.
		ksort( $restrictions[ $cache_key ] );
		// Remove priority keys.
		$restrictions[ $cache_key ] = array_values( $restrictions[ $cache_key ] );
	}

	return $restrictions[ $cache_key ];
}

/**
 * Check if the referrer is the sites admin area.
 *
 * @return bool
 *
 * @since 2.2.0
 */
function check_referrer_is_admin() {
	$referrer = wp_get_raw_referer();
	if ( empty( $referrer ) ) {
		return false;
	}

	$admin_url = admin_url();
	// Normalize URLs for comparison.
	$normalized_referrer  = strtolower( $referrer );
	$normalized_admin_url = strtolower( $admin_url );

	// Compare the beginning of the referrer with the admin URL.
	return str_starts_with( $normalized_referrer, $normalized_admin_url );
}

/**
 * Check if request is excluded.
 *
 * @return bool
 *
 * @since 2.3.1
 */
function request_is_excluded_rest_endpoint() {
	/**
	 * Filter whether to exclude a request from being restricted.
	 *
	 * @param bool $is_excluded Whether to exclude the request.
	 *
	 * @return bool
	 */
	return apply_filters( 'content_control/request_is_excluded_rest_endpoint', ! is_wp_core_rest_namespace() );
}

/**
 * Check if request is excluded.
 *
 * @return bool
 *
 * @since 2.3.0
 */
function request_is_excluded() {
	static $is_excluded;

	if ( isset( $is_excluded ) ) {
		return $is_excluded;
	}

	$is_excluded = false;

	if (
		// Check if doing cron.
		is_cron() ||
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		( is_ajax() && isset( $_REQUEST['action'] ) && 'heartbeat' === $_REQUEST['action'] ) ||
		// If this is rest request and not core wp namespace.
		( is_rest() && request_is_excluded_rest_endpoint() )
	) {
		$is_excluded = true;
	}

	return $is_excluded;
}

/**
 * Check if the request is for a priveleged user in the admin area.
 *
 * @return bool
 *
 * @since 2.3.0
 */
function request_for_user_is_excluded() {
	// Check if user has permission to manage settings and is on the admin area.
	if ( user_is_excludable() ) {
		if (
			// Is in the admin area.
			is_admin() ||
			( is_preview() && current_user_can( 'edit_post', get_the_ID() ) ) ||
			// Is an ajax request from the admin area.
			(
				( is_ajax() || is_rest() ) &&
				check_referrer_is_admin()
			)
		) {
			return true;
		}
	}

	return false;
}

/**
 * Check if protection methods should be disabled.
 *
 * Generally used to bypass protections when using page editors.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function protection_is_disabled() {
	static $protection_disabled;

	if ( isset( $protection_disabled ) ) {
		return $protection_disabled;
	}

	$protection_disabled = user_is_excluded() || request_is_excluded() || request_for_user_is_excluded();

	/**
	 * Filter whether protection is disabled.
	 *
	 * @param bool $is_disabled Whether protection is disabled.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	$protection_disabled = apply_filters( 'content_control/protection_is_disabled', $protection_disabled );

	return $protection_disabled;
}
