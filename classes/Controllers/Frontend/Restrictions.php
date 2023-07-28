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
		add_action( 'the_content', [ $this, 'the_content_if_restricted' ], 1000 );
		add_action( 'get_the_excerpt', [ $this, 'get_the_excerpt_if_restricted' ], 1000, 2 );
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

		$restriction = $this->matching_restriction();

		// Bail if we didn't match a restriction.
		if ( ! $restriction ) {
			return;
		}

		$is_archive_page = \is_home() || \is_archive() || \is_search();

		switch ( $restriction->protection_method ) {
			case 'redirect':
				$this->redirect( $restriction );
				break;
			case 'replace':
				// If this is an archive handle it based on the archive handling setting.
				if ( ! $is_archive_page ) {
					// Overload the query with the replacement page.
					$this->set_query_to_page( $restriction->replacement_page );
				} else {
					switch ( $restriction->archive_handling ) {
						case 'filter_post_content':
							break;
						case 'replace_archive_page':
							// Overload the query with the replacement page.
							$this->set_query_to_page( $restriction->replacement_page );
							break;
						case 'redirect':
							$this->redirect( $restriction );
							break;
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
	public function the_content_if_restricted( $content ) {
		$filter_name = 'content_control/post_restricted_content';

		// Ensure we don't get into an infinite loop.
		if ( doing_filter( $filter_name ) || doing_filter( 'get_the_excerpt' ) ) {
			return $content;
		}

		$post = get_post();

		// If this isn't a post type that can be restricted, bail.
		if ( ! $post || $this->can_bail_early( $post ) ) {
			return $content;
		}

		$restriction = $this->matching_restriction();

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

		$post = get_post( $post );

		// If this isn't a post type that can be restricted, bail.
		if ( ! $post || $this->can_bail_early( $post ) ) {
			return $post_excerpt;
		}

		$restriction = $this->matching_restriction();

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
	 * Check if we can bail early.
	 *
	 * @param \WP_Post|null $post Post object.
	 *
	 * @return \ContentControl\Models\Restriction|bool
	 */
	public function can_bail_early( $post = null ) {
		// Bail if this isn't the main query on the frontend.
		if ( ! \ContentControl\is_frontend() ) {
			return true;
		}

		if ( user_is_excluded() || protection_is_disabled() ) {
			return true;
		}

		if ( ! content_is_restricted( $post ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Check if the current query is restricted.
	 *
	 * @return \ContentControl\Models\Restriction|bool
	 */
	public function matching_restriction() {
		return $this->container->get( 'restrictions' )->get_applicable_restriction();
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
