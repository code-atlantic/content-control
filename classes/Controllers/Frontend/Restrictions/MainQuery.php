<?php
/**
 * Frontend main query restrictions.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend\Restrictions;

use ContentControl\Base\Controller;

use function ContentControl\redirect;
use function ContentControl\get_main_wp_query;
use function ContentControl\set_query_to_page;
use function ContentControl\reset_query_context;
use function ContentControl\query_can_be_ignored;
use function ContentControl\content_is_restricted;
use function ContentControl\override_query_context;
use function ContentControl\protection_is_disabled;
use function ContentControl\get_applicable_restriction;
use function ContentControl\get_restriction_matches_for_queried_posts;

defined( 'ABSPATH' ) || exit;

/**
 * Class for handling global restrictions of the Main Query.
 *
 * @package ContentControl
 */
class MainQuery extends Controller {

	/**
	 * Initiate functionality.
	 */
	public function init() {
		// This can be done no later than template_redirect, and no sooner than send_headers (when conditional tags are available).
		// Can be done on send_headers, posts_selection, or wp as well.
		add_action( 'template_redirect', [ $this, 'restrict_main_query' ], 10 );
	}

	/**
	 * Handle a restriction on the main query.
	 *
	 * NOTE: This is only for redirecting or replacing pages and
	 *       should not be used to filter or hide post contents.
	 *
	 * @return void
	 */
	public function restrict_main_query() {
		if ( ! \is_main_query() || protection_is_disabled() ) {
			return;
		}

		$this->check_main_query();
		$this->check_main_query_posts();
	}

	/**
	 * Handle restrictions on the main query.
	 *
	 * NOTE: This is only for redirecting or replacing archives and
	 *       should not be used to filter or hide post contents.
	 *
	 * @return void
	 */
	public function check_main_query() {
		// Bail if we didn't match any restrictions.
		if ( content_is_restricted() ) {
			$restriction = get_applicable_restriction();

			/**
			 * Use this filter to prevent a post from being restricted, or to handle it yourself.
			 *
			 * @param null|mixed                              $pre        Whether to prevent the post from being restricted.
			 * @param null|\ContentControl\Models\Restriction $restriction Restriction object.
			 * @return null|mixed
			 */
			if ( null !== apply_filters( 'content_control/pre_restrict_main_query', null, $restriction ) ) {
				return;
			}

			/**
			 * Fires when a post is restricted, but before the restriction is handled.
			 *
			 * @param \ContentControl\Models\Restriction $restriction Restriction object.
			 */
			do_action( 'content_control/restrict_main_query', $restriction );

			$method = $restriction->get_setting( 'protectionMethod' );

			switch ( $method ) {
				case 'redirect':
					redirect( $restriction->get_setting( 'redirectType' ), $restriction->get_setting( 'redirectUrl' ) );
					return;

				case 'replace':
					if ( 'page' === $restriction->get_setting( 'replacementType' ) ) {
						set_query_to_page( $restriction->get_setting( 'replacementPage' ) );
						return;
					}
			}
		}
	}

	/**
	 * Handle restrictions on the main query posts.
	 *
	 * NOTE: This is only for redirecting or replacing archives and
	 *       should not be used to filter or hide post contents.
	 *
	 * @return void
	 */
	public function check_main_query_posts() {
		$query = get_main_wp_query();

		if ( query_can_be_ignored( $query ) ) {
			return;
		}

		// Ensure rules are checked in the correct context.
		override_query_context( 'main/posts' );

		// Get restrictions for the queried posts.
		$post_restrictions = get_restriction_matches_for_queried_posts( $query );

		// Reset query context.
		reset_query_context();

		if ( ! $post_restrictions ) {
			return;
		}

		// Only the highest priority restriction is needed with redirect or replace handling.
		$restriction_match = false;

		// Find the highest priority restriction with redirect or replace handling.
		foreach ( $post_restrictions as $post_restriction ) {
			/**
			 * Restriction object.
			 *
			 * @var \ContentControl\Models\Restriction
			 */
			$restriction = $post_restriction['restriction'];

			if ( 'redirect' === $restriction->get_setting( 'archiveHandling' ) || 'replace_archive_page' === $restriction->get_setting( 'archiveHandling' ) ) {
				$restriction_match = $post_restriction;
				break;
			}
		}

		if ( false === $restriction_match ) {
			return;
		}

		/**
		 * Restriction object.
		 *
		 * @var \ContentControl\Models\Restriction
		 */
		$restriction = $restriction_match['restriction'];
		$post_ids    = $restriction_match['post_ids'];

		/**
		 * Use this filter to prevent a post from being restricted, or to handle it yourself.
		 *
		 * @param null|mixed                              $pre         Whether to prevent the post from being restricted.
		 * @param null|\ContentControl\Models\Restriction $restriction Restriction object.
		 * @param int[]                                   $post_id     Post ID.
		 *
		 * @return null|mixed
		 */
		if ( null !== apply_filters( 'content_control/pre_restrict_main_query_post', null, $restriction, $post_ids ) ) {
			return;
		}

		/**
		 * Fires when a post is restricted, but before the restriction is handled.
		 *
		 * @param \ContentControl\Models\Restriction $restriction Restriction object.
		 * @param int[]                              $post_id     Post ID.
		 */
		do_action( 'content_control/restrict_main_query_post', $restriction, $post_ids );

		switch ( $restriction->get_setting( 'archiveHandling' ) ) {
			case 'replace_archive_page':
				set_query_to_page( $restriction->get_setting( 'archiveReplacementPage' ) );
				break;
			case 'redirect':
				redirect( $restriction->get_setting( 'archiveRedirectType' ), $restriction->get_setting( 'archiveRedirectUrl' ) );
				break;
		}
	}
}
