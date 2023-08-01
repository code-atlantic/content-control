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

/**
 * Check if admins are excluded from restrictions.
 *
 * @return bool True if admins are excluded, false if not.
 */
function admins_are_excluded() {
	return plugin()->get_option( 'excludeAdmins' );
}

/**
 * Current user is excluded from restrictions.
 *
 * @return bool True if user is excluded, false if not.
 */
function user_is_excluded() {
	return admins_are_excluded() && current_user_can( plugin()->get_permission( 'manage_settings' ) );
}

/**
 * Check if user meets requirements.
 *
 * @param string       $user_status logged_in or logged_out.
 * @param array|string $user_roles array of roles to check.
 * @param string       $role_match any|match|exclude.
 *
 * @return bool True if user meets requirements, false if not.
 */
function user_meets_requirements( $user_status, $user_roles = [], $role_match = 'match' ) {
	if ( empty( $user_status ) ) {
		// Always default to protecting content.
		return false;
	}

	// If roles is string, convert to array.
	if ( is_string( $user_roles ) ) {
		$user_roles = explode( ',', $user_roles );
		$user_roles = array_map( 'trim', $user_roles );
		$user_roles = array_map( 'strtolower', $user_roles );
	}

	// If roles is array of keyed roles, convert to array of roles[].
	if ( is_string( key( $user_roles ) ) ) {
		$user_roles = array_keys( $user_roles );
	}

	$logged_in = is_user_logged_in();

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

			// true for match, false for exclude.
			$match_value = 'match' === $role_match ? true : false;

			// Checks all roles, any match will return.
			foreach ( $user_roles as $role ) {
				if ( current_user_can( $role ) ) {
					return $match_value;
				}
			}

			// If we got this far, we're logged in but don't have the required role.
			return ! $match_value;

		case 'logged_out':
			return ! $logged_in;

		default:
			return false;
	}

	return false;
}

/**
 * Redirect to the appropriate location.
 *
 * @param string $type login|home|custom.
 * @param string $url  Custom URL.
 *
 * @return void
 */
function redirect( $type = 'login', $url = null ) {
	switch ( $type ) {
		case 'login':
			$url = wp_login_url( \ContentControl\get_current_page_url() );
			break;

		case 'home':
			$url = home_url();
			break;

		default:
		case 'custom':
			// Do nothing.
	}

	if ( $url ) {
		wp_safe_redirect( $url );
		exit;
	}
}

/**
 * Set the query to the page with the specified ID.
 *
 * @param int       $page_id Page ID.
 * @param \WP_Query $query   Query object.
 * @return void
 */
function set_query_to_page( $page_id, $query = null ) {
	if ( ! $page_id ) {
		return;
	}

	if ( ! $query ) {
		/**
		 * Global WP_Query object.
		 *
		 * @var \WP_Query $wp_query
		 */
		global $wp_query;
		$query = $wp_query;
	}

	// Create a new custom query for the specific page.
	$args = [
		'page_id'        => $page_id,
		'post_type'      => 'page',
		'posts_per_page' => 1,
	];

	$custom_query = new \WP_Query( $args );

	if ( ! $custom_query->have_posts() ) {
		return;
	}

	$query->init(); // Reset the main query.
	$query->query_vars        = $args;
	$query->queried_object    = $custom_query->post;
	$query->queried_object_id = $page_id;
	$query->post              = $custom_query->post;
	$query->posts             = $custom_query->posts;
	$query->query             = $custom_query->query;

	// Since init, only override defaults as needed to emulate page.
	$query->is_page       = true;
	$query->is_singular   = true;
	$query->found_posts   = 1;
	$query->post_count    = 1;
	$query->max_num_pages = 1;

	// Suppress filters. Might not need this.
	$query->set( 'suppress_filters', true );

	// Reset the post data.
	$query->reset_postdata();
}
