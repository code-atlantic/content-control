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
	 *
	 * @return void
	 */
	public function init() {
		/**
		 * Use this filter to change the hook used to add query post filtering.
		 *
		 * @param null|string $init_hook The hook to use to add the query post filtering.
		 * @return null|string The hook to use, should be: setup_theme, after_theme_setup, init or wp_loaded.
		 */
		$init_hook = apply_filters( 'content_control/query_filter_init_hook', null );

		if ( is_null( $init_hook ) ) {
			$this->late_hooks();
			return;
		}

		/**
		 * Use this filter to change the priority used to add query post filtering.
		 *
		 * @param int $init_priority The priority to use to add the query post filtering.
		 * @return int The priority to use.
		 */
		$init_priority = apply_filters( 'content_control/query_filter_init_priority', 10 );

		add_action( (string) $init_hook, [ $this, 'late_hooks' ], (int) $init_priority );
	}

	/**
	 * Late hooks.
	 *
	 * @return void
	 */
	public function late_hooks() {
		add_filter( 'the_posts', [ $this, 'restrict_query_posts' ], 10, 2 );
	}

	/**
	 * Handle restricted content appropriately.
	 *
	 * NOTE. This is only for filtering posts, and should not
	 *       be used to redirect or replace the entire page.
	 *
	 * @param \WP_Post[] $posts Array of post objects.
	 * @param \WP_Query  $query The WP_Query instance (passed by reference).
	 *
	 * @return \WP_Post[]
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

			/**
			 * Use this filter to prevent a post from being restricted, or to handle it yourself.
			 *
			 * @param null|mixed                              $pre         Whether to prevent the post from being restricted.
			 * @param null|\ContentControl\Models\Restriction $restriction Restriction object.
			 * @param int[]                                   $post_id     Post ID.
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

			$handling = $query->is_main_query() ? $restriction->archive_handling : $restriction->additional_query_handling;

			switch ( $handling ) {
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
