<?php
/**
 * Restriction utility & helper functions.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

use function ContentControl\plugin;

/**
 * Get restriction, by ID, slug or object.
 *
 * @param int|string|\ContentControl\Models\Restriction $restriction Restriction ID, slug or object.
 *
 * @return \ContentControl\Models\Restriction|null
 */
function get_restriction( $restriction ) {
	return plugin( 'restrictions' )->get_restriction( $restriction );
}

/**
 * Check if admins are excluded from restrictions.
 *
 * @return bool True if admins are excluded, false if not.
 */
function admins_are_excluded() {
	return get_data_version( 'settings' ) > 1 && plugin()->get_option( 'excludeAdmins' );
}

/**
 * Current user is excluded from restrictions.
 *
 * @return bool True if user is excluded, false if not.
 */
function user_is_excludable() {
	return \current_user_can( plugin()->get_permission( 'manage_settings' ) );
}

/**
 * Current user is excluded from restrictions.
 *
 * @return bool True if user is excluded, false if not.
 */
function user_is_excluded() {
	return admins_are_excluded() && user_is_excludable();
}

/**
 * Check if user meets requirements.
 *
 * @param string                               $user_status logged_in or logged_out.
 * @param string[]|array<string,string>|string $user_roles array of roles to check.
 * @param string                               $role_match any|match|exclude.
 *
 * @return bool True if user meets requirements, false if not.
 */
function user_meets_requirements( $user_status, $user_roles = [], $role_match = 'match' ) {
	if ( empty( $user_status ) ) {
		// Always default to protecting content.
		return false;
	}

	if ( ! in_array( $user_status, [ 'logged_in', 'logged_out' ], true ) ) {
		// Invalid user status.
		return false;
	}

	if ( ! is_array( $user_roles ) ) {
		// If roles is string, convert to array.
		$user_roles = explode( ',', $user_roles );
		$user_roles = array_map( 'trim', $user_roles );
		$user_roles = array_map( 'strtolower', $user_roles );
	}

	// If roles is array of keyed roles, convert to array of roles[].
	if ( is_string( key( $user_roles ) ) ) {
		$user_roles = array_keys( $user_roles );
	}

	$logged_in = \is_user_logged_in();

	switch ( $user_status ) {
		case 'logged_in':
			// If not logged in, return false.
			if ( ! $logged_in ) {
				return false;
			}

			// If current user is excluded from restrictions, return true.
			if ( user_is_excluded() ) {
				return true;
			}

			// If we got this far, we're logged in.
			if ( 'any' === $role_match || empty( $user_roles ) ) {
				return true;
			}

			if ( ! in_array( $role_match, [ 'match', 'exclude' ], true ) ) {
				// Invalid role match.
				return false;
			}

			// True for match, false for exclude.
			$match_value = 'match' === $role_match ? true : false;

			// Checks all roles, any match will return.
			foreach ( $user_roles as $role ) {
				if ( \current_user_can( $role ) ) {
					return $match_value;
				}
			}

			// If we got this far, we're logged in but don't have the required role.
			return ! $match_value;

		case 'logged_out':
			return ! $logged_in;
	}
}

/**
 * Check if a given query can be ignored.
 *
 * @param \WP_Query|\WP_Term_Query $query Query object.
 *
 * @return bool True if query can be ignored, false if not.
 *
 * @since 2.2.0 Added support for WP_Term_Query.
 */
function query_can_be_ignored( $query = null ) {
	// Early bypass.
	$bypass = \apply_filters( 'content_control/pre_query_can_be_ignored', null, $query );
	if ( null !== $bypass ) {
		return $bypass;
	}

	if ( $query instanceof \WP_Query ) {
		if ( $query->get( 'ignore_restrictions', false ) ) {
			return true;
		}

		// Skip post types that are not public.
		if ( $query->get( 'post_type' ) ) {
			$post_types = $query->get( 'post_type' );

			// If post type is a string, convert to array.
			if ( is_string( $post_types ) ) {
				$post_types = explode( ',', $post_types );
			}

			foreach ( $post_types as $post_type ) {
				// Check if post type exists.
				if ( ! post_type_exists( $post_type ) ) {
					continue;
				}

				$post_type_object = get_post_type_object( $post_type );

				// Check if post type is public.
				if ( ! $post_type_object->public ) {
					return true;
				}
			}
		}

		$post_types_to_ignore = \apply_filters( 'content_control/post_types_to_ignore', [
			'cc_restriction',
			'wp_template',
			'wp_template_part',
			'wp_global_styles',
			'oembed_cache',
		] );

		// Ignore specific core post types.
		if ( in_array( $query->get( 'post_type' ), $post_types_to_ignore, true ) ) {
			return true;
		}
	}

	if ( $query instanceof \WP_Term_Query ) {
		// Skip taxonomies that are not public.
		if ( isset( $query->query_vars['taxonomy'] ) ) {
			$taxonomies = $query->query_vars['taxonomy'];

			// If taxonomy is a string, convert to array.
			if ( is_string( $taxonomies ) ) {
				$taxonomies = explode( ',', $taxonomies );
			}

			foreach ( $taxonomies as $taxonomy ) {
				// Check if taxonomy exists.
				if ( ! taxonomy_exists( $taxonomy ) ) {
					continue;
				}

				$taxonomy_object = get_taxonomy( $taxonomy );

				// Check if taxonomy is public.
				if ( ! $taxonomy_object->public ) {
					return true;
				}
			}
		}

		// Ignore specific core taxonomies.
		$taxonomies_to_ignore = \apply_filters( 'content_control/taxonomies_to_ignore', [
			'nav_menu',
			'link_category',
			'post_format',
			'wp_theme',
		] );

		$query_taxonomies = isset( $query->query_vars['taxonomy'] ) ? (array) $query->query_vars['taxonomy'] : [];

		foreach ( (array) $taxonomies_to_ignore as $taxonomy ) {
			if ( in_array( $taxonomy, $query_taxonomies, true ) ) {
				return true;
			}
		}

		static $last_term_query = null;

		if ( $last_term_query && doing_filter( 'get_terms' ) &&
		(
			$query === $last_term_query ||
			wp_json_encode( $query->query_vars ) === wp_json_encode( $last_term_query->query_vars )
		)
		) {
			return true;
		}

		$last_term_query = $query;
	}

	return false !== \apply_filters( 'content_control/ignoreable_query', false, $query );
}
