<?php
/**
 * Restriction utility & helper functions.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl;

use function ContentControl\plugin;
use function ContentControl\set_rules_query;

defined( 'ABSPATH' ) || exit;

/**
 * Check if content has restrictions.
 *
 * @param int|null $post_id Post ID.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_has_restrictions( $post_id = null ) {
	$overload_post = setup_post( $post_id );

	$has_restrictions = plugin( 'restrictions' )->has_applicable_restrictions( $post_id );

	// Clear post if we overloaded it.
	if ( $overload_post ) {
		clear_post();
	}

	/**
	 * Filter whether content has restrictions.
	 *
	 * @param bool $has_restrictions Whether content has restrictions.
	 * @param int|null $post_id Post ID.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	return (bool) apply_filters( 'content_control/content_has_restriction', $has_restrictions, $post_id );
}

/**
 * Check if user can access content.
 *
 * @param int|null $post_id Post ID.
 *
 * @return bool True if user meets requirements, false if not.
 *
 * @since 2.0.0
 */
function user_can_view_content( $post_id = null ) {
	if ( ! content_has_restrictions( $post_id ) ) {
		return true;
	}

	$can_view = true;

	$restrictions = [];

	if ( false === (bool) apply_filters( 'content_control/check_all_restrictions', false, $post_id ) ) {
		$restriction = get_applicable_restriction( $post_id );

		if ( null !== $restriction ) {
			$can_view       = $restriction->user_meets_requirements();
			$restrictions[] = $restriction;
		}
	} else {
		$restrictions = get_all_applicable_restrictions( $post_id );

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
	 * @param int|null $post_id Post ID.
	 * @param \ContentControl\Models\Restriction[] $restrictions Restrictions.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	return (bool) apply_filters( 'content_control/user_can_view_content', $can_view, $post_id, $restrictions );
}

/**
 * Helper that checks if given or current post is restricted or not.
 *
 * @see \ContentControl\user_can_view_content() to check if user can view content.
 *
 * @param int|null $post_id Post ID.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_restricted( $post_id = null ) {
	$is_restricted = ! user_can_view_content( $post_id );

	/**
	 * Filter whether content is restricted.
	 *
	 * @param bool $is_restricted Whether content is restricted.
	 * @param int|null $post_id Post ID.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	return (bool) apply_filters( 'content_control/content_is_restricted', $is_restricted, $post_id );
}

/**
 * Get applicable restriction.
 *
 * @param int|null $post_id Post ID.
 *
 * @return \ContentControl\Models\Restriction|false
 *
 * @since 2.0.0
 */
function get_applicable_restriction( $post_id = null ) {
	$overload_post = setup_post( $post_id );

	$restriction = plugin( 'restrictions' )->get_applicable_restriction( $post_id );

	// Clear post if we overloaded it.
	if ( $overload_post ) {
		clear_post();
	}

	return $restriction;
}

/**
 * Get all applicable restrictions.
 *
 * @param int|null $post_id Post ID.
 *
 * @return \ContentControl\Models\Restriction[]
 *
 * @since 2.0.11
 */
function get_all_applicable_restrictions( $post_id = null ) {
	$overload_post = setup_post( $post_id );

	$restrictions = plugin( 'restrictions' )->get_all_applicable_restrictions( $post_id );

	// Clear post if we overloaded it.
	if ( $overload_post ) {
		clear_post();
	}

	return $restrictions;
}

/**
 * Check if query has restrictions.
 *
 * @param \WP_Query $query Query object.
 *
 * @return array<array{restriction:\ContentControl\Models\Restriction,post_ids:int[]}>|false
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
		if ( content_is_restricted( $post->ID ) ) {
			$restriction = get_applicable_restriction( $post->ID );

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
 * Check if protection methods should be disabled.
 *
 * Generally used to bypass protections when using page editors.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function protection_is_disabled() {
	$checks = [
		// Disable protection when not on the frontend.
		! \ContentControl\is_frontend(),
		// Disable protection when user is excluded.
		user_is_excluded(),
		// Disable protection when viewing post previews.
		is_preview() && current_user_can( 'edit_post', get_the_ID() ),
	];

	/**
	 * Filter whether protection is disabled.
	 *
	 * @param bool $is_disabled Whether protection is disabled.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	return apply_filters(
		'content_control/protection_is_disabled',
		in_array( true, $checks, true )
	);
}
