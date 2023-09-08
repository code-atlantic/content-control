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
use function ContentControl\set_query_to_page;
use function ContentControl\content_is_restricted;
use function ContentControl\protection_is_disabled;
use function ContentControl\get_applicable_restriction;

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
	 */
	public function restrict_main_query() {
		if ( ! \is_main_query() || protection_is_disabled() ) {
			return;
		}

		if ( ! content_is_restricted() ) {
			return;
		}

		$restriction = get_applicable_restriction();

		// Bail if we didn't match any restrictions.
		if ( ! $restriction ) {
			return;
		}

		/**
		 * Use this filter to prevent a post from being restricted, or to handle it yourself.
		 *
		 * @param null                               $pre        Whether to prevent the post from being restricted.
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

		switch ( $restriction->protection_method ) {
			case 'redirect':
				redirect( $restriction->redirect_type, $restriction->redirect_url );
				return;

			case 'replace':
				if ( 'page' === $restriction->replacement_type ) {
				set_query_to_page( $restriction->replacement_page );
				return;
		}
	}
}
}
