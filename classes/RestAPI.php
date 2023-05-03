<?php
/**
 * RestAPI blocks setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl;

defined( 'ABSPATH' ) || exit;

use ContentControl\Base\Controller;

/**
 * RestAPI function initialization.
 */
class RestAPI extends Controller {
	/**
	 * Initiate rest api integrations.
	 */
	public function init() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	/**
	 * Register Rest API routes.
	 */
	public function register_routes() {
		( new RestAPI\BlockTypes() )->register_routes();
		( new RestAPI\License() )->register_routes();
		( new RestAPI\ObjectSearch() )->register_routes();
		( new RestAPI\Settings() )->register_routes();
	}
}
