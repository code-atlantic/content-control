<?php
/**
 * RestAPI blocks setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers;

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
	 *
	 * @return void
	 */
	public function register_routes() {
		( new \ContentControl\RestAPI\BlockTypes() )->register_routes();
		( new \ContentControl\RestAPI\License() )->register_routes();
		( new \ContentControl\RestAPI\ObjectSearch() )->register_routes();
		( new \ContentControl\RestAPI\Settings() )->register_routes();
	}
}
