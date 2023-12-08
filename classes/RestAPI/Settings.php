<?php
/**
 * RestAPI Global Settings Endpoint.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\RestAPI;

use WP_REST_Controller, WP_REST_Response, WP_REST_Server, WP_Error;
use function ContentControl\get_all_plugin_options;
use function ContentControl\update_plugin_options;

defined( 'ABSPATH' ) || exit;

/**
 * Rest API Settings Controller Class.
 */
class Settings extends WP_REST_Controller {

	/**
	 * Endpoint namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'content-control/v2';

	/**
	 * Route base.
	 *
	 * @var string
	 */
	protected $base = 'settings';

	/**
	 * Register API endpoint routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_settings' ],
					'permission_callback' => '__return_true', // Read only, so anyone can view.
				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_settings' ],
					'permission_callback' => [ $this, 'update_settings_permissions' ],
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				],
				'schema' => [ $this, 'get_schema' ],
			]
		);
	}

	/**
	 * Get plugin settings.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_settings() {
		$settings = get_all_plugin_options();

		if ( $settings ) {
			return new WP_REST_Response( [ 'settings' => $settings ], 200 );
		} else {
			return new WP_Error( '404', __( 'Something went wrong, the settings could not be found.', 'content-control' ), [ 'status' => 404 ] );
		}
	}

	/**
	 * Update plugin settings.
	 *
	 * @param \WP_REST_Request<array<string,mixed>> $request Request object.
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function update_settings( $request ) {
		$settings = $request->get_param( 'settings' );

		$error_message = __( 'Something went wrong, the settings could not be updated.', 'content-control' );

		if ( ! get_all_plugin_options() ) {
			return new WP_Error( '500', $error_message, [ 'status' => 500 ] );
		}

		$updated      = update_plugin_options( $settings );
		$new_settings = get_all_plugin_options();

		if ( $updated ) {
			return new WP_REST_Response( $new_settings, 200 );
		} else {
			return new WP_Error( '404', $error_message, [ 'status' => 404 ] );
		}
	}

	/**
	 * Check update settings permissions.
	 *
	 * @return WP_Error|bool
	 */
	public function update_settings_permissions() {
		return current_user_can( 'manage_options' ) || current_user_can( 'activate_plugins' );
	}

	/**
	 * Get settings schema.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	public function get_schema() {
		if ( $this->schema ) {
			// Bail early if already cached.
			return $this->schema;
		}

		$this->schema = apply_filters(
			'content_control_rest_settings_schema',
			[
				'$schema'    => 'http://json-schema.org/draft-04/schema#',
				'title'      => 'settings',
				'type'       => 'object',
				'properties' => [
					'settings' => [
						'type' => 'object',
					],
				],
			]
		);

		return $this->schema;
	}
}
