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
		// 'wp_redirect'
		add_action( 'content_control/restrict_main_query', [ $this, 'restrict_main_query' ], 10 );
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
}
