<?php
/**
 * RestAPI Global Settings Endpoint.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\RestAPI;

use WP_User_Query, WP_Rest_Controller, WP_REST_Response, WP_REST_Server, WP_Error;

defined( 'ABSPATH' ) || exit;

/**
 * Rest API Object Search Controller Class.
 */
class ObjectSearch extends WP_REST_Controller {

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
	protected $base = 'objectSearch';

	/**
	 * Register API endpoint routes.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'object_search' ],
					'permission_callback' => '__return_true', // Read only, so anyone can view.
				],
			]
		);
	}

	/**
	 * Get block type list.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function object_search() {
		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_REQUEST['nonce'] ) ), 'content_control_object_search_nonce' ) ) {
			wp_send_json_error();
		}

		$results = [
			'items'       => [],
			'total_count' => 0,
		];

		$object_type = isset( $_REQUEST['object_type'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['object_type'] ) ) : '';
		$include     = ! empty( $_REQUEST['include'] ) ? wp_parse_id_list( wp_unslash( $_REQUEST['include'] ) ) : [];
		$exclude     = ! empty( $_REQUEST['exclude'] ) ? wp_parse_id_list( wp_unslash( $_REQUEST['exclude'] ) ) : [];

		if ( ! empty( $include ) ) {
			$exclude = array_merge( $include, $exclude );
		}

		switch ( $object_type ) {
			case 'post_type':
				$post_type = ! empty( $_REQUEST['object_key'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['object_key'] ) ) : 'post';

				if ( ! empty( $include ) ) {
					$include_query = $this->post_type_selectlist_query(
						$post_type,
						[
							'post__in'       => $include,
							'posts_per_page' => - 1,
						],
						true
					);

					foreach ( $include_query['items'] as $id => $name ) {
						$results['items'][] = [
							'id'   => $id,
							'text' => "$name (ID: $id)",
						];
					}

					$results['total_count'] += (int) $include_query['total_count'];
				}

				$query = $this->post_type_selectlist_query(
					$post_type,
					[
						's'              => ! empty( $_REQUEST['s'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['s'] ) ) : null,
						'paged'          => ! empty( $_REQUEST['paged'] ) ? absint( $_REQUEST['paged'] ) : null,
						'post__not_in'   => $exclude,
						'posts_per_page' => 10,
					],
					true
				);

				foreach ( $query['items'] as $id => $name ) {
					$results['items'][] = [
						'id'   => $id,
						'text' => "$name (ID: $id)",
					];
				}

				$results['total_count'] += (int) $query['total_count'];
				break;

			case 'taxonomy':
				$taxonomy = ! empty( $_REQUEST['object_key'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['object_key'] ) ) : 'category';

				if ( ! empty( $include ) ) {
					$include_query = $this->taxonomy_selectlist_query(
						$taxonomy,
						[
							'include' => $include,
							'number'  => 0,
						],
						true
					);

					foreach ( $include_query['items'] as $id => $name ) {
						$results['items'][] = [
							'id'   => $id,
							'text' => "$name (ID: $id)",
						];
					}

					$results['total_count'] += (int) $include_query['total_count'];
				}

				$query = $this->taxonomy_selectlist_query(
					$taxonomy,
					[
						'search'  => ! empty( $_REQUEST['s'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['s'] ) ) : null,
						'paged'   => ! empty( $_REQUEST['paged'] ) ? absint( $_REQUEST['paged'] ) : null,
						'exclude' => $exclude,
						'number'  => 10,
					],
					true
				);

				foreach ( $query['items'] as $id => $name ) {
					$results['items'][] = [
						'id'   => $id,
						'text' => "$name (ID: $id)",
					];
				}

				$results['total_count'] += (int) $query['total_count'];
				break;
			case 'user':
				if ( ! current_user_can( 'list_users' ) ) {
					wp_send_json_error();
				}

				$user_role = ! empty( $_REQUEST['object_key'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['object_key'] ) ) : null;

				if ( ! empty( $include ) ) {
					$include_query = $this->user_selectlist_query(
						[
							'role'    => $user_role,
							'include' => $include,
							'number'  => - 1,
						],
						true
					);

					foreach ( $include_query['items'] as $id => $name ) {
						$results['items'][] = [
							'id'   => $id,
							'text' => "$name (ID: $id)",
						];
					}

					$results['total_count'] += (int) $include_query['total_count'];
				}

				$query = $this->user_selectlist_query(
					[
						'role'    => $user_role,
						'search'  => ! empty( $_REQUEST['s'] ) ? '*' . sanitize_text_field( wp_unslash( $_REQUEST['s'] ) ) . '*' : null,
						'paged'   => ! empty( $_REQUEST['paged'] ) ? absint( $_REQUEST['paged'] ) : null,
						'exclude' => $exclude,
						'number'  => 10,
					],
					true
				);

				foreach ( $query['items'] as $id => $name ) {
					$results['items'][] = [
						'id'   => $id,
						'text' => "$name (ID: $id)",
					];
				}

				$results['total_count'] += (int) $query['total_count'];
				break;
		}

		// Take out keys which were only used to deduplicate.
		$results['items'] = array_values( $results['items'] );

		if ( $results ) {
			return new WP_REST_Response( $results, 200 );
		} else {
			return new WP_Error( '404', __( 'Something went wrong, the results could not be returned.', 'content-control' ), [ 'status' => 404 ] );
		}
	}


	/**
	 * Get a list of posts for a select list.
	 *
	 * @param array   $post_type Post type(s) to query.
	 * @param array   $args   Query arguments.
	 * @param boolean $include_total Whether to include the total count in the response.
	 * @return array
	 */
	public function post_type_selectlist_query( $post_type = [], $args = [], $include_total = false ) {
		if ( empty( $post_type ) ) {
			$post_type = [ 'any' ];
		}

		$args = wp_parse_args( $args, [
			'posts_per_page'         => 10,
			'post_type'              => $post_type,
			'post__in'               => null,
			'post__not_in'           => null,
			'post_status'            => null,
			'page'                   => 1,
			// Performance Optimization.
			'no_found_rows'          => ! $include_total ? true : false,
			'update_post_term_cache' => false,
			'update_post_meta_cache' => false,
		] );

		if ( 'attachment' === $post_type ) {
			$args['post_status'] = 'inherit';
		}

		// Query Caching.
		static $queries = [];

		$key = md5( maybe_serialize( $args ) );

		if ( ! isset( $queries[ $key ] ) ) {
			$query = new \WP_Query( $args );

			$posts = [];
			foreach ( $query->posts as $post ) {
				$posts[ $post->ID ] = $post->post_title;
			}

			$results = [
				'items'       => $posts,
				'total_count' => $query->found_posts,
			];

			$queries[ $key ] = $results;
		} else {
			$results = $queries[ $key ];
		}

		return ! $include_total ? $results['items'] : $results;
	}

	/**
	 * Get a list of terms for a select list.
	 *
	 * @param array   $taxonomies Taxonomy(s) to query.
	 * @param array   $args Query arguments.
	 * @param boolean $include_total Whether to include the total count in the response.
	 * @return array
	 */
	public function taxonomy_selectlist_query( $taxonomies = [], $args = [], $include_total = false ) {
		if ( empty( $taxonomies ) ) {
			$taxonomies = [ 'category' ];
		}

		$args = wp_parse_args( $args, [
			'hide_empty' => false,
			'number'     => 10,
			'search'     => '',
			'include'    => null,
			'exclude'    => null,
			'offset'     => 0,
			'page'       => null,
			'taxonomy'   => $taxonomies,
		] );

		if ( $args['page'] ) {
			$args['offset'] = ( $args['page'] - 1 ) * $args['number'];
		}

		// Query Caching.
		static $queries = [];

		$key = md5( maybe_serialize( $args ) );

		if ( ! isset( $queries[ $key ] ) ) {
			$terms = [];

			foreach ( get_terms( $args ) as $term ) {
				$terms[ $term->term_id ] = $term->name;
			}

			$total_args           = $args;
			$total_args['fields'] = 'count';
			unset( $total_args['number'] );
			unset( $total_args['offset'] );

			$results = [
				'items'       => $terms,
				'total_count' => $include_total ? get_terms( $total_args ) : null,
			];

			$queries[ $key ] = $results;
		} else {
			$results = $queries[ $key ];
		}

		return ! $include_total ? $results['items'] : $results;
	}

	/**
	 * Get a list of users for a select list.
	 *
	 * @param array $args Query arguments.
	 * @param bool  $include_total Whether to include the total count in the response.
	 *
	 * @return array|mixed
	 */
	public function user_selectlist_query( $args = [], $include_total = false ) {
		$args = wp_parse_args(
			$args,
			[
				'role'        => null,
				'count_total' => ! $include_total ? true : false,
			]
		);

		// Query Caching.
		static $queries = [];

		$key = md5( maybe_serialize( $args ) );

		if ( ! isset( $queries[ $key ] ) ) {
			$query = new WP_User_Query( $args );

			$users = [];
			foreach ( $query->get_results() as $user ) {
				$users[ $user->ID ] = $user->display_name;
			}

			$results = [
				'items'       => $users,
				'total_count' => $query->get_total(),
			];

			$queries[ $key ] = $results;
		} else {
			$results = $queries[ $key ];
		}

		return ! $include_total ? $results['items'] : $results;
	}

}
