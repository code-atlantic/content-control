<?php
/**
 * Post type setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;

/**
 * Post type controller.
 */
class PostTypes extends Controller {

	/**
	 * Init controller.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'init', [ $this, 'register_post_type' ] );
		add_action( 'init', [ $this, 'register_rest_fields' ] );
		add_action( 'save_post_cc_restriction', [ $this, 'save_post' ], 10, 3 );
		add_filter( 'rest_pre_dispatch', [ $this, 'rest_pre_dispatch' ], 10, 3 );
		add_filter( 'content_control/sanitize_restriction_settings', [ $this, 'sanitize_restriction_settings' ], 10, 2 );
		add_filter( 'content_control/validate_restriction_settings', [ $this, 'validate_restriction_settings' ], 10, 2 );
	}

	/**
	 * Register `restriction` post type.
	 *
	 * @return void
	 */
	public function register_post_type() {
		/**
		 * Post Type: Restrictions.
		 */
		$labels = [
			'name'          => __( 'Restrictions', 'content-control' ),
			'singular_name' => __( 'Restriction', 'content-control' ),
		];

		$args = [
			'label'               => __( 'Restrictions', 'content-control' ),
			'labels'              => $labels,
			'description'         => '',
			'public'              => false,
			'publicly_queryable'  => false,
			'show_ui'             => false,
			'show_in_rest'        => true,
			'rest_base'           => 'restrictions',
			'rest_namespace'      => 'content-control/v2',
			'has_archive'         => false,
			'show_in_menu'        => false,
			'show_in_nav_menus'   => false,
			'delete_with_user'    => false,
			'exclude_from_search' => true,
			'map_meta_cap'        => true,
			'hierarchical'        => false,
			'can_export'          => true,
			'rewrite'             => false,
			'query_var'           => false,
			'supports'            => [
				'title',
				'excerpt',
				// 'editor',
			],
			'show_in_graphql'     => false,
			'capabilities'        => [
				'create_posts' => $this->container->get_permission( 'edit_restrictions' ),
				'edit_posts'   => $this->container->get_permission( 'edit_restrictions' ),
				'delete_posts' => $this->container->get_permission( 'edit_restrictions' ),
			],
		];

		register_post_type( 'cc_restriction', $args );
	}

	/**
	 * Registers custom REST API fields for cc_restrictions post type.
	 *
	 * @return void
	 */
	public function register_rest_fields() {
		register_rest_field( 'cc_restriction', 'settings', [
			'get_callback'        => function ( $obj, $field, $request ) {
				$settings = get_post_meta( $obj['id'], 'restriction_settings', true );

				// Backfill from content if empty.
				if ( empty( $settings['customMessage'] ) ) {
					$settings['customMessage'] = get_post_field( 'post_content', $obj['id'], 'raw' );
				}

				if ( ! empty( $settings['customMessage'] ) ) {
					// Change output based on context.
					$settings['customMessage'] = 'edit' === $request->get_param( 'context' ) ?
						sanitize_post_field( 'post_content', $settings['customMessage'], $obj['id'], 'raw' ) :
						sanitize_post_field( 'post_content', $settings['customMessage'], $obj['id'], 'display' );
				}

				return $settings;
			},
			'update_callback'     => function ( $value, $obj ) {
				$custom_message = ! empty( $value['customMessage'] ) ? $value['customMessage'] : '';

				// Save custom message to restriction content for now.
				wp_update_post( [
					'ID'           => $obj->ID,
					'post_content' => $custom_message,
				] );

				// Update the field/meta value.
				update_post_meta( $obj->ID, 'restriction_settings', $value );
			},
			'schema'              => [
				'type'        => 'object',
				'arg_options' => [
					'sanitize_callback' => function ( $settings, $request ) {
						/**
						 * Sanitize the restriction settings.
						 *
						 * @param array<string,mixed> $settings The settings to sanitize.
						 * @param int   $id       The restriction ID.
						 * @param \WP_REST_Request $request The request object.
						 *
						 * @return array<string,mixed> The sanitized settings.
						 */
						return apply_filters( 'content_control/sanitize_restriction_settings', $settings, $request->get_param( 'id' ), $request );
					},
					'validate_callback' => function ( $settings, $request ) {
						/**
						 * Validate the restriction settings.
						 *
						 * @param array<string,mixed> $settings The settings to validate.
						 * @param int   $id       The restriction ID.
						 * @param \WP_REST_Request $request The request object.
						 *
						 * @return bool|\WP_Error True if valid, WP_Error if not.
						 */
						return apply_filters( 'content_control/validate_restriction_settings', $settings, $request->get_param( 'id' ), $request );
					},
				],
			],
			'permission_callback' => function () {
				return current_user_can( $this->container->get_permission( 'edit_restrictions' ) );
			},
		] );

		register_rest_field( 'cc_restriction', 'priority', [
			'get_callback'        => function ( $obj ) {
				return (int) get_post_field( 'menu_order', $obj['id'], 'raw' );
			},
			'update_callback'     => function ( $value, $obj ) {
				wp_update_post( [
					'ID'         => $obj->ID,
					'menu_order' => $value,
				] );
			},
			'permission_callback' => function () {
				return current_user_can( $this->container->get_permission( 'edit_restrictions' ) );
			},
			'schema'              => [
				'type'        => 'integer',
				'arg_options' => [
					'sanitize_callback' => function ( $priority ) {
						return absint( $priority );
					},
					'validate_callback' => function ( $priority ) {
						return is_int( $priority );
					},
				],
			],
		] );

		register_rest_field( 'cc_restriction', 'data_version', [
			'get_callback'        => function ( $obj ) {
				return get_post_meta( $obj['id'], 'data_version', true );
			},
			'update_callback'     => function ( $value, $obj ) {
				// Update the field/meta value.
				update_post_meta( $obj->ID, 'data_version', $value );
			},
			'permission_callback' => function () {
				return current_user_can( $this->container->get_permission( 'edit_restrictions' ) );
			},
		] );
	}

	/**
	 * Sanitize restriction settings.
	 *
	 * @param array<string,mixed> $settings The settings to sanitize.
	 * @param int                 $id       The restriction ID.
	 *
	 * @return array<string,mixed> The sanitized settings.
	 */
	public function sanitize_restriction_settings( $settings, $id ) {

		// Sanitize custom message.
		if ( ! empty( $settings['customMessage'] ) ) {
			$settings['customMessage'] = sanitize_post_field( 'post_content', $settings['customMessage'], $id, 'db' );
		}

		return $settings;
	}

	/**
	 * Validate restriction settings.
	 *
	 * @param array<string,mixed> $settings The settings to validate.
	 * @param int                 $id       The restriction ID.
	 *
	 * @return bool|\WP_Error True if valid, WP_Error if not.
	 */
	public function validate_restriction_settings( $settings, $id ) {
		// TODO Validate all known settings by type.
		return true;
	}


	/**
	 * Add data version meta to new restrictions.
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post object.
	 * @param bool     $update  Whether this is an existing post being updated or not.
	 *
	 * @return void
	 */
	public function save_post( $post_id, $post, $update ) {
		if ( $update ) {
			return;
		}

		add_post_meta( $post_id, 'data_version', 1 );
	}

	/**
	 * Prevent access to restrictions endpoint.
	 *
	 * @param mixed                                 $result Response to replace the requested version with.
	 * @param \WP_REST_Server                       $server Server instance.
	 * @param \WP_REST_Request<array<string,mixed>> $request  Request used to generate the response.
	 * @return mixed
	 */
	public function rest_pre_dispatch( $result, $server, $request ) {
		// Get the route being requested.
		$route = $request->get_route();

		// Only proceed if we're creating a user.
		if ( false === strpos( $route, '/content-control/v2/restrictions' ) ) {
			return $result;
		}

		$current_user_can = current_user_can( $this->container->get_permission( 'edit_restrictions' ) );

		// Prevent discovery of the endpoints data from unauthorized users.
		if ( ! $current_user_can ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'Access to this endpoint requires authorization.', 'content-control' ),
				[
					'status' => rest_authorization_required_code(),
				]
			);
		}

		// Return data to the client to parse.
		return $result;
	}
}
