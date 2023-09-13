<?php
/**
 * Option functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

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
			add_filter( 'allowed_redirect_hosts', function ( $hosts ) use ( $url ) {
				$hosts[] = wp_parse_url( $url, PHP_URL_HOST );

				return $hosts;
			} );
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
		$query = get_current_wp_query();
	}

	// Create a new custom query for the specific page.
	$args = [
		'page_id'             => $page_id,
		'post_type'           => 'page',
		'posts_per_page'      => 1,
		// Used to bypass the restrictions and not add processing to the new query.
		'ignore_restrictions' => true,
	];

	$custom_query = new \WP_Query( $args );

	if ( ! $custom_query->have_posts() ) {
		return;
	}

	$query->init(); // Reset the main query.
	$query->query_vars = $args;

	// phpcs:disable:Squiz.PHP.CommentedOutCode.Found
	// $query->queried_object    = $custom_query->post;
	// $query->queried_object_id = $page_id;
	// $query->post              = $custom_query->post;
	// $query->posts             = $custom_query->posts;
	// $query->query             = $custom_query->query;

	// // Since init, only override defaults as needed to emulate page.
	// $query->is_page       = true;
	// $query->is_singular   = true;
	// $query->found_posts   = 1;
	// $query->post_count    = 1;
	// $query->max_num_pages = 1;

	// // Suppress filters. Might not need this.
	// $query->set( 'suppress_filters', true );
	// phpcs:enable:Squiz.PHP.CommentedOutCode.Found

	// Ensure all query vars are set.
	$query->get_posts();

	// Reset the post data.
	$query->reset_postdata();
}
