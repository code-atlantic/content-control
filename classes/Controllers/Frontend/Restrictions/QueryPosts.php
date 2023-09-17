<?php
/**
 * Frontend query post restrictions.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend\Restrictions;

use ContentControl\Base\Controller;

use function ContentControl\query_can_be_ignored;
use function ContentControl\protection_is_disabled;
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
		add_filter( 'the_posts', [ $this, 'restrict_query_posts' ], 10, 2 );
	}

	/**
	 * Handle restricted content appropriately.
	 *
	 * NOTE. This is only for filtering posts, and should not
	 *       be used to redirect or replace the entire page.
	 *
	 * @param WP_Post[] $posts Array of post objects.
	 * @param \WP_Query $query The WP_Query instance (passed by reference).
	 *
	 * @return WP_Post[]
	 */
	public function restrict_query_posts( $posts, $query ) {
		if ( protection_is_disabled() ) {
			return $posts;
		}

		if ( query_can_be_ignored( $query ) ) {
			return $posts;
		}

		$post_restrictions = get_restriction_matches_for_queried_posts( $query );

		if ( false === $post_restrictions ) {
			return $posts;
		}

		// If we have restrictions on the queried posts, handle them top down.
		foreach ( $post_restrictions as $match ) {
			$post_id     = $match['post_ids'];
			$restriction = $match['restriction'];

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
				continue;
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
				case 'hide':
					foreach ( $posts as $key => $post ) {
						if ( in_array( $post->ID, $post_id, true ) ) {
							unset( $posts[ $key ] );
						}
					}

					// Update the query's post count.
					$query->post_count = count( $posts );
					// Reset post indexes.
					$posts = array_values( $posts );
					break;
			}
		}

		return $posts;
	}
}
