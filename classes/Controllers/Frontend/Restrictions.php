<?php
/**
 * Frontend page setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend;

use ContentControl\Base\Controller;

use function ContentControl\user_is_excluded;
use function ContentControl\content_is_restricted;
use function ContentControl\protection_is_disabled;
use function ContentControl\get_applicable_restriction;
use function ContentControl\queried_posts_have_restrictions;
use function ContentControl\get_restriction_matches_for_queried_posts;

defined( 'ABSPATH' ) || exit;

/**
 * Class for handling global restrictions.
 *
 * @package ContentControl
 */
class Restrictions extends Controller {

	/**
	 * Initiate functionality.
	 */
	public function init() {
		// This can be done no later than template_redirect, and no sooner than send_headers (when conditional tags are available).
		// Can be done on send_headers, posts_selection, or wp as well.
		add_action( 'template_redirect', [ $this, 'restrict_content' ], 10 );
		add_filter( 'the_content', [ $this, 'filter_the_content_if_restricted' ], 1000 );
		add_filter( 'get_the_excerpt', [ $this, 'get_the_excerpt_if_restricted' ], 1000, 2 );

		// add_filter( 'the_title', [ $this, 'filter_the_title_if_restricted'], 1000, 2 );
		// add_filter( 'the_content', [ $this, 'filter_the_content_if_restricted' ], 1000 );
		// add_filter( 'get_the_excerpt', [ $this, 'filter_the_excerpt_if_restricted' ], 1000, 2 );
		// add_filter( 'post_class', [ $this, 'filter_post_class_if_restricted' ], 1000, 3 );
		// add_filter( 'body_class', [ $this, 'filter_body_class_if_restricted' ], 1000, 2 );

		// add_filter( 'post_password_required', [ $this, 'require_password_if_restricted' ], 1000, 2 );
		// add_filter( 'the_password_form', [ $this, 'filter_password_form_if_restricted' ], 1000, 2 );
	}

	/**
	 * Check if we can bail early.
	 *
	 * @return \ContentControl\Models\Restriction|bool
	 */
	public function can_bail_early() {
		// Bail if this isn't the main query on the frontend.
		if ( ! \ContentControl\is_frontend() ) {
			return true;
		}

		if ( user_is_excluded() || protection_is_disabled() ) {
			return true;
		}

		return false;
	}

	/**
	 * Handle restricted content appropriately.
	 *
	 * @return void
	 */
	public function restrict_content() {
		if ( ! \is_main_query() || $this->can_bail_early() ) {
			return;
		}

		if ( ! content_is_restricted() && ! queried_posts_have_restrictions() ) {
			return;
		}

		$restriction       = get_applicable_restriction();
		$post_restrictions = get_restriction_matches_for_queried_posts();

		// Bail if we didn't match any restrictions.
		if ( ! $restriction && ! $post_restrictions ) {
			return;
		}

		// If we have a restriction, handle it.
		if ( false !== $restriction ) {
			// If we have a restriction on the main query, handle it & bail.
			if ( $this->restrict_main_query( $restriction ) ) {
				return;
			}
		}

		// If we have restrictions on the queried posts, handle them top down.
		if ( false !== $post_restrictions ) {
			foreach ( $post_restrictions as $match ) {
				$this->restrict_archive_post( $match['restriction'], $match['post_ids'] );
			}
		}
	}

	/**
	 * Handle a restriction on the main query.
	 *
	 * @param \ContentControl\Models\Restriction $restriction Restriction object.
	 * @return bool
	 */
	public function restrict_main_query( $restriction ) {
		/**
		 * Use this filter to prevent a post from being restricted, or to handle it yourself.
		 *
		 * @param null                               $pre        Whether to prevent the post from being restricted.
		 * @param null|\ContentControl\Models\Restriction $restriction Restriction object.
		 * @return null|mixed
		 */
		if ( null !== apply_filters( 'content_control/pre_restrict_main_query', null, $restriction ) ) {
			return true;
		}

		/**
		 * Fires when a post is restricted, but before the restriction is handled.
		 *
		 * @param \ContentControl\Models\Restriction $restriction Restriction object.
		 */
		do_action( 'content_control/restrict_main_query', $restriction );

		switch ( $restriction->protection_method ) {
			case 'redirect':
				$this->redirect( $restriction );
				return true;

			case 'replace':
				$this->set_query_to_page( $restriction->replacement_page );
				return true;
		}

		return false;
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
				$this->set_query_to_page( $restriction->replacement_page );
				break;
			case 'redirect':
				$this->redirect( $restriction );
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
	 * Filter post content when needed.
	 *
	 * @param string $content Content of post being checked.
	 *
	 * @return string
	 */
	public function filter_the_content_if_restricted( $content ) {
		$filter_name = 'content_control/post_restricted_content';

		// Ensure we don't get into an infinite loop.
		if ( doing_filter( $filter_name ) || doing_filter( 'get_the_excerpt' ) ) {
			return $content;
		}

		// If this isn't a post type that can be restricted, bail.
		if ( $this->can_bail_early() ) {
			return $content;
		}

		if ( ! content_is_restricted() ) {
			return;
		}

		$restriction = get_applicable_restriction();

		/**
		 * Filter the message to display when a post is restricted.
		 *
		 * @param string $message     Message to display.
		 * @param object $restriction Restriction object.
		 *
		 * @return string
		 */
		return apply_filters(
			$filter_name,
			$restriction->get_message(),
			$restriction
		);
	}

	/**
	 * Filter post excerpt when needed.
	 *
	 * @param string  $post_excerpt The post excerpt.
	 * @param WP_Post $post         Post object.
	 *
	 * @return string
	 */
	public function get_the_excerpt_if_restricted( $post_excerpt, $post ) {
		$filter_name = 'content_control/post_restricted_excerpt';

		if ( doing_filter( $filter_name ) ) {
			return $post_excerpt;
		}

		// If this isn't a post type that can be restricted, bail.
		if ( $this->can_bail_early() ) {
			return $post_excerpt;
		}

		if ( ! content_is_restricted( $post ) ) {
			return $post_excerpt;
		}

		$restriction = get_applicable_restriction();

		/**
		 * Filter the excerpt to display when a post is restricted.
		 *
		 * @param string $message     Message to display.
		 * @param object $restriction Restriction object.
		 *
		 * @return string
		 */
		return apply_filters(
			$filter_name,
			$restriction->get_message(),
			$restriction
		);
	}

	/**
	 * Set the query to the page with the specified ID.
	 *
	 * @param int       $page_id Page ID.
	 * @param \WP_Query $query   Query object.
	 * @return void
	 */
	public function set_query_to_page( $page_id, $query = null ) {
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

	/**
	 * Redirect to the appropriate location.
	 *
	 * @param Restriction $restriction Restriction object.
	 * @return void
	 */
	public function redirect( $restriction ) {
		$redirect = false;

		switch ( $restriction->redirect_type ) {
			case 'login':
				$redirect = wp_login_url( \ContentControl\get_current_page_url() );
				break;

			case 'home':
				$redirect = home_url();
				break;

			case 'custom':
				$redirect = $restriction->redirect_url;
				break;

			default:
				// Do not redirect if not one of our values.
		}

		if ( $redirect ) {
			wp_safe_redirect( $redirect );
			exit;
		}
	}
}
