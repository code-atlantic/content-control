<?php
/**
 * The Events Calendar
 *
 * @package ContentControl
 */

namespace ContentControl\Controllers\Compatibility;

use ContentControl\Base\Controller;

/**
 * TheEventsCalendar controller class.
 */
class TheEventsCalendar extends Controller {

	/**
	 * Initiate hooks & filter.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'content_control/restrict_main_query', [ $this, 'restrict_main_query' ], 10 );
		// add_filter( 'content_control/determine_uknonwn_rest_api_intent', [ $this, 'get_rest_api_intent' ], 10, 2 );
		// add_filter( 'content_control/request_is_excluded_rest_endpoint', [ $this, 'request_is_excluded_rest_endpoint' ], 10 );
		// add_filter( 'content_control/pre_query_can_be_ignored', [ $this, 'pre_query_can_be_ignored' ], 10, 2 );
	}

	/**
	 * Check if controller is enabled.
	 *
	 * @return bool
	 */
	public function controller_enabled() {
		return class_exists( '\Tribe__Events__Main' ) && defined( 'TRIBE_EVENTS_FILE' );
	}

	/**
	 * Handle restrictions on the main query.
	 *
	 * When the main query is set to be redirected, TEC was cancelling the redirect. Returing true will allow the redirect to happen.
	 *
	 * @return void
	 */
	public function restrict_main_query() {
		// If during the main query, a redirect is called on the events page, we need to allow it to happen.
		add_filter( 'wp_redirect', function ( $location ) {
			// Only call this filter within the redirect filter. Limiting the scope of the filter.
			add_filter( 'tec_events_views_v2_redirected', '__return_true' );
			return $location;
		}, 0 );
	}

	/**
	 * Check if request is excluded.
	 *
	 * @param bool $is_excluded Whether to exclude the request.
	 *
	 * @return bool
	 */
	public function request_is_excluded_rest_endpoint( $is_excluded ) {
		global $wp;

		$rest_route = isset( $wp->query_vars['rest_route'] ) ? $wp->query_vars['rest_route'] : '';

		if ( $rest_route && strpos( $rest_route, '/tribe/' ) === 0 ) {
			// Ignore all but the /v1/events endpoint.
			if ( strpos( $rest_route, '/tribe/events/v1/events' ) !== 0 ) {
				$is_excluded = true;
			} else {
				$is_excluded = false;
			}
		}

		return $is_excluded;
	}

	/**
	 * Get intent for the REST API.
	 *
	 * @param array<string,mixed> $intent Intent.
	 * @param string              $rest_route Rest API route.
	 *
	 * @return array<string,mixed>
	 */
	public function get_rest_api_intent( $intent, $rest_route ) {
		// Fill in proper values for TEC event type.
		if ( strpos( $rest_route, '/tribe/events/v1/events' ) === 0 ) {
			$intent['type'] = 'post_type';
			$intent['name'] = 'tribe_events';

			// Does it have an ID in the route? Need to check for that.
			if ( preg_match( '/tribe\/events\/v1\/events\/(\d+)/', $rest_route, $matches ) ) {
				$intent['id'] = $matches[1];
			} else {
				// Otherwise, it's a list of events.
				$intent['index'] = true;
			}

			// Check if we have a search query.
			// phpcs:disable WordPress.Security.NonceVerification.Recommended
			if ( isset( $_GET['s'] ) ) {
				$intent['search'] = sanitize_text_field( wp_unslash( $_GET['s'] ) );
			}
			// phpcs:enable WordPress.Security.NonceVerification.Recommended
		}

		return $intent;
	}

	/**
	 * Bypass Filter Queries on Events in calendar view.
	 *
	 * @param  bool      $ignore Whether or not to restrict the query.
	 * @param  \WP_Query $query  The query.
	 *
	 * @return bool     Whether or not to filter the query.
	 */
	public function pre_query_can_be_ignored( $ignore, $query ) {

		if ( did_action( 'tribe_repository_events_pre_get_posts' ) && 'tribe_events' === $query->get( 'post_type' ) ) {
			// return true;
		}

		return $ignore;
	}
}
