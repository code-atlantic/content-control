<?php
/**
 * Query functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

/**
 * Get the current wp query.
 *
 * Helper that returns the current query object, reguardless of if
 * it's the main query or not.
 *
 * @return \WP_Query|null
 */
function current_wp_query() {
	global $wp_the_query, $wp_query;

	if ( ! is_null( $wp_query ) ) {
		/**
		 * WP Query object.
		 *
		 * @var \WP_Query $wp_query
		 */
		return $wp_query;
	}

	if ( ! is_null( $wp_the_query ) ) {
		/**
		 * WP Query object.
		 *
		 * @var \WP_Query $wp_the_query
		 */
		return $wp_the_query;
	}

	return null;
}

/**
 * Get the current query.
 *
 * MOVE to a new file, maybe content-control/inc/functions/query.php
 *
 * @param \WP_Query|null $query Query object.
 *
 * @return \WP_Query
 */
function get_query( $query = null ) {
	global $cc_current_query;

	if ( is_null( $query ) ) {
		if ( isset( $cc_current_query ) && ! is_null( $cc_current_query ) ) {
			/**
			 * WP Query object.
			 *
			 * @var \WP_Query $query
			 */
			$query = $cc_current_query;
		} else {
			$query = current_wp_query();
		}
	}

	return $query;
}

/**
 * Get or set the current rule (globaly accessible).
 *
 * MOVE to a new file, maybe content-control/inc/functions/query.php
 *
 * 'main', 'main/posts', 'posts', 'main/blocks', 'blocks`
 *
 * Rules can work differently depending on the context they are being checked in.
 * This context allows us to handle the main query differently to other queries,
 * and blocks. It further allows us to handle blocks in several unique ways per
 * rule.
 *
 *  1. Main query is checked in the template_redirect action.
 *  2. Main query posts are checked in the the_posts filter & $wp_query->is_main_query().
 *  3. Alternate query posts are checked in the_posts or pre_get_posts & ! $wp_query->is_main_query().
 *  4. Blocks are checked in the content_control/should_hide_block filter.
 *
 * @param \WP_Query|null $query Query object.
 *
 * @return string 'main', 'main/posts', 'posts', 'main/blocks', 'blocks`.
 */
function current_query_context( $query = null ) {
	$query = get_query( $query );

	$posts_check = doing_filter( 'pre_get_posts' ) || doing_filter( 'the_posts' );

	$context_checks = [
		// 1. Main query (page/psst/home/search/archive etc) (template_redirect)
		'main'        => $query->is_main_query() && doing_action( 'template_redirect' ),
		// 2. Check posts in the main query. (the_posts)
		'main/posts'  => $query->is_main_query() && $posts_check,
		// 2. Check posts in the other queries. (the_posts)
		'posts'       => ! $query->is_main_query() && $posts_check,
		// 4. Blocks in the main page
		'main/blocks' => $query->is_main_query() && doing_filter( 'content_control/should_hide_block' ),
		// 5. Blocks in query posts
		'blocks'      => ! $query->is_main_query() && doing_filter( 'content_control/should_hide_block' ),
	];

	foreach ( $context_checks as $context => $check ) {
		if ( $check ) {
			return $context;
		}
	}
}

/**
 * Set the current rule (globaly accessible).
 *
 * Because we check posts in `the_posts`, we can't trust the global $wp_query
 * has been set yet, so we need to manage global state ourselves.
 *
 * @param string $query WP_Query object.
 *
 * @return void
 */
function set_rules_query( $query ) {
	global $cc_current_query;
	$cc_current_query = $query;
}

/**
 * Check and overload global post if needed.
 *
 * MOVE to a new file, maybe content-control/inc/functions/query.php
 *
 * @param int|null $post_id Post ID.
 *
 * @return bool
 */
function setup_post( $post_id = null ) {
	global $post;

	$overload_post = isset( $post_id ) && isset( $post ) && (
		( is_object( $post_id ) && $post_id->ID !== $post->ID ) ||
		( is_int( $post_id ) && $post_id !== $post->ID ) );

	if ( $overload_post ) {
        // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$post = get_post( $post_id );
		setup_postdata( $post );
	}

	return $overload_post;
}

/**
 * Check and clear global post if needed.
 *
 * MOVE to a new file, maybe content-control/inc/functions/query.php
 *
 * @param bool $overload_post Whether post was overloaded.
 *
 * @return void
 */
function clear_post( $overload_post = false ) {
	if ( $overload_post ) {
		// Reset global post object.
		wp_reset_postdata();
	}
}
