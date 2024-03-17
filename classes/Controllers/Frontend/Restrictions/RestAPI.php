<?php
/**
 * Frontend Rest API query restrictions.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend\Restrictions;

use ContentControl\Base\Controller;

use function ContentControl\content_is_restricted;
use function ContentControl\protection_is_disabled;
use function ContentControl\get_applicable_restriction;

defined( 'ABSPATH' ) || exit;

/**
 * Class for handling global restrictions of the Rest API.
 *
 * @package ContentControl
 */
class RestAPI extends Controller {

	/**
	 * Initiate functionality.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'rest_pre_dispatch', [ $this, 'pre_dispatch' ], 1, 3 );
	}

	/**
	 * Handle a restriction on the rest api via pre_dispatch.
	 *
	 * @param mixed $result  Response to replace the requested resource with. Can be anything a normal endpoint can return, or null to not hijack the request.
	 * @param mixed $server  Server instance.
	 * @param mixed $request Request used to generate the response.
	 *
	 * @return mixed
	 */
	public function pre_dispatch( $result, $server, $request ) { // phpcs:ignore
		if ( protection_is_disabled() ) {
			return $result;
		}

		if ( content_is_restricted() ) {
			$restriction = get_applicable_restriction();

			/**
			 * Fires when a post is restricted, but before the restriction is handled.
			 *
			 * @param \ContentControl\Models\Restriction $restriction Restriction object.
			 */
			do_action( 'content_control/restrict_rest_query', $restriction );

			$method = $restriction->get_setting( 'restApiQueryHandling', 'forbidden' );

			switch ( $method ) {
				// If we got here, the default is to return a rest_forbidden response.
				case 'forbidden':
					// Mimic a rest_forbidden response.
					return new \WP_Error(
						'rest_forbidden',
						$restriction->get_setting( 'restApiQueryMessage', __( 'You do not have permission to do this.', 'content-control' ), ),
						[ 'status' => 403 ]
					);
			}
		}

		return $result;
	}
}
