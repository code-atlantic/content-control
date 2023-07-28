<?php
/**
 * Frontend page setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend;

use ContentControl\Base\Controller;

use function ContentControl\content_is_restricted;
use function ContentControl\protection_is_disabled;
use function ContentControl\user_is_excluded;

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
		add_action( 'template_redirect', [ $this, 'redirect_if_restricted' ], 10 );
	}

	public function restrict_content() {
		if ( $this->can_bail_early() ) {
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
	 * Check if we can bail early.
	 *
	 * @return \ContentControl\Models\Restriction|bool
	 */
	public function can_bail_early() {
		// Bail if this isn't the main query on the frontend.
		if (
			! \ContentControl\is_frontend() ||
			! \is_main_query()
		) {
			return true;
		}

		if ( user_is_excluded() || protection_is_disabled() ) {
			return true;
		}

		if ( ! content_is_restricted() ) {
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
