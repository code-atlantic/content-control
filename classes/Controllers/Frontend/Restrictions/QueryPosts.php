<?php
/**
 * Frontend query post restrictions.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend\Restrictions;

use ContentControl\Base\Controller;

use function ContentControl\redirect;
use function ContentControl\set_query_to_page;
use function ContentControl\protection_is_disabled;
use function ContentControl\queried_posts_have_restrictions;
use function ContentControl\get_restriction_matches_for_queried_posts;

defined( 'ABSPATH' ) || exit;

/**
 * Class for handling global restrictions of the query posts.
 *
 * @package ContentControl
 */
class QueryPosts extends Controller {

	/**
	 * Initiate functionality.
	 */
	public function init() {
		// This can be done no later than template_redirect, and no sooner than send_headers (when conditional tags are available).
		// Can be done on send_headers, posts_selection, or wp as well.
		add_action( 'template_redirect', [ $this, 'restrict_main_query_posts' ], 10 );
		// add_filter( 'the_posts', [ $this, 'filter_the_posts' ], 10, 2 );

		// add_filter( 'post_password_required', [ $this, 'require_password_if_restricted' ], 1000, 2 );
	}

	/**
	 * Handle restricted content appropriately.
	 *
	 * @return void
	 */
	public function restrict_main_query_posts() {
		if ( ! \is_main_query() || protection_is_disabled() ) {
			return;
		}

		$post_restrictions = get_restriction_matches_for_queried_posts();

		if ( ! $post_restrictions ) {
			return;
		}

		// If we have restrictions on the queried posts, handle them top down.
		foreach ( $post_restrictions as $match ) {
			$this->restrict_archive_post( $match['restriction'], $match['post_ids'] );
		}
	}

	/**
	 * Handle post restrictions within main query loop.
	 *
	 * @param \ContentControl\Models\Restriction $restriction Restriction object.
	 * @param int|int[]                          $post_id     Post ID.
	 * @return void
	 */
	public function restrict_archive_post( $restriction, $post_id ) {
		if ( is_int( $post_id ) ) {
			$post_id = [ $post_id ];
		}

		/**
		 * Use this filter to prevent a post from being restricted, or to handle it yourself.
		 *
		 * @param null                                    $pre         Whether to prevent the post from being restricted.
		 * @param null|\ContentControl\Models\Restriction $restriction Restriction object.
		 * @param int[]                               $post_id     Post ID.
		 * @return null|mixed
		 */
		if ( null !== apply_filters( 'content_control/pre_restrict_archive_post', null, $restriction, $post_id ) ) {
			return;
		}

		/**
		 * Fires when a post is restricted, but before the restriction is handled.
		 *
		 * @param \ContentControl\Models\Restriction $restriction Restriction object.
		 * @param int[]                          $post_id     Post ID.
		 */
		do_action( 'content_control/restrict_archive_post', $restriction, $post_id );

		switch ( $restriction->archive_handling ) {
			case 'filter_post_content':
				// Filter the title/excerpt/contents of the restricted items.
				break;
			case 'replace_archive_page':
				set_query_to_page( $restriction->replacement_page );
				break;
			case 'redirect':
				redirect( $restriction->archive_redirect_type, $restriction->archive_redirect_url );
				break;
			case 'hide':
				global $wp_query;
				foreach ( $wp_query->posts as $key => $post ) {
					if ( in_array( $post->ID, $post_id, true ) ) {
						unset( $wp_query->posts[ $key ] );
					}
				}
				break;
		}
	}

	/**
	 * Filter the_posts array to remove restricted posts.
	 *
	 * @param array     $posts Array of posts.
	 * @param \WP_Query $query Query object.
	 *
	 * @return array
	 */
	public function filter_the_posts( $posts, $query ) {
		if ( protection_is_disabled() ) {
			return $posts;
		}

		// Id rhia ia the main query,

		if ( ! queried_posts_have_restrictions( $query ) ) {
			return true;
		}

		$restrictions = get_restriction_matches_for_queried_posts( $query );

		if ( ! $restrictions ) {
			return $posts;
		}
	}
}
