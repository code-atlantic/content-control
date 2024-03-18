<?php
/**
 * RestAPI Global Settings Endpoint.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\RestAPI;

use WP_User_Query, WP_REST_Controller, WP_REST_Response, WP_REST_Server, WP_Error;

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
					'callback'            => [ $this, 'object_search' ],
					'permission_callback' => '__return_true', // Read only, so anyone can view.
					'args'                => [
						'nonce'      => [
							'description' => __( 'Nonce', 'content-control' ),
							'type'        => 'string',
							'required'    => true,
						],
						'hash'       => [
							'description' => __( 'Hash', 'content-control' ),
							'type'        => 'string',
							'required'    => true,
						],
						'entityKind' => [
							'description' => __( 'Object kind, (postType, taxonomy)', 'content-control' ),
							'type'        => 'string',
							'required'    => true,
						],
						'entityType' => [
							'description' => __( 'Object type (post, category)', 'content-control' ),
							'type'        => 'string',
							'required'    => true,
						],
						'paged'      => [
							'description' => __( 'Page number', 'content-control' ),
							'type'        => 'integer',
							'required'    => false,
						],
						's'          => [
							'description' => __( 'Search term', 'content-control' ),
							'type'        => 'string',
							'required'    => false,
						],
						'include'    => [
							'description' => __( 'Include IDs', 'content-control' ),
							'type'        => 'string',
							'required'    => false,
						],
						'exclude'    => [
							'description' => __( 'Exclude IDs', 'content-control' ),
							'type'        => 'string',
							'required'    => false,
						],
					],
				],
			]
		);
	}

	/**
	 * Get block type list.
	 *
	 * @param \WP_REST_Request<array<string,mixed>> $request Request object.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function object_search( $request ) {
		$nonce  = $request->get_param( 'nonce' );
		$params = $request->get_params();

		if ( ! isset( $nonce ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $nonce ) ), 'content_control_object_search_nonce' ) ) {
			wp_send_json_error();
		}

		try {
			$results = [
				'hash'       => $request->get_param( 'hash' ),
				'items'      => [],
				'totalCount' => 0,
			];

			$object_kind = isset( $params['entityKind'] ) ? sanitize_text_field( wp_unslash( $params['entityKind'] ) ) : '';
			$object_type = isset( $params['entityType'] ) ? sanitize_text_field( wp_unslash( $params['entityType'] ) ) : '';
			$include     = ! empty( $params['include'] ) ? wp_parse_id_list( wp_unslash( $params['include'] ) ) : [];
			$exclude     = ! empty( $params['exclude'] ) ? wp_parse_id_list( wp_unslash( $params['exclude'] ) ) : [];

			if ( ! empty( $include ) ) {
				$exclude = array_merge( $include, $exclude );
			}

			switch ( $object_kind ) {
				case 'post_type':
					$post_type = ! empty( $object_type ) ? $object_type : 'post';

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

						$results['totalCount'] += (int) $include_query['totalCount'];
					}

					$query = $this->post_type_selectlist_query(
						$post_type,
						[
							's'              => ! empty( $params['s'] ) ? sanitize_text_field( wp_unslash( $params['s'] ) ) : null,
							'paged'          => ! empty( $params['paged'] ) ? absint( $params['paged'] ) : null,
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

					$results['totalCount'] += (int) $query['totalCount'];
					break;

				case 'taxonomy':
					$taxonomy = ! empty( $params['object_key'] ) ? sanitize_text_field( wp_unslash( $params['object_key'] ) ) : 'category';

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

						$results['totalCount'] += (int) $include_query['totalCount'];
					}

					$query = $this->taxonomy_selectlist_query(
						$taxonomy,
						[
							'search'  => ! empty( $params['s'] ) ? sanitize_text_field( wp_unslash( $params['s'] ) ) : null,
							'paged'   => ! empty( $params['paged'] ) ? absint( $params['paged'] ) : null,
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

					$results['totalCount'] += (int) $query['totalCount'];
					break;
				case 'user':
					if ( ! current_user_can( 'list_users' ) ) {
						wp_send_json_error();
					}

					$user_role = ! empty( $params['object_key'] ) ? sanitize_text_field( wp_unslash( $params['object_key'] ) ) : null;

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

						$results['totalCount'] += (int) $include_query['totalCount'];
					}

					$query = $this->user_selectlist_query(
						[
							'role'    => $user_role,
							'search'  => ! empty( $params['s'] ) ? '*' . sanitize_text_field( wp_unslash( $params['s'] ) ) . '*' : null,
							'paged'   => ! empty( $params['paged'] ) ? absint( $params['paged'] ) : null,
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

					$results['totalCount'] += (int) $query['totalCount'];
					break;
			}

			// Take out keys which were only used to deduplicate.
			$results['items'] = array_values( $results['items'] );

			return new WP_REST_Response( $results, 200 );
		} catch ( \Exception $e ) {
			return new WP_Error( '500', __( 'Something went wrong, the results could not be returned.', 'content-control' ), [ 'status' => 500 ] );
		}
	}


	/**
	 * Get a list of posts for a select list.
	 *
	 * @param string              $post_type Post type(s) to query.
	 * @param array<string,mixed> $args   Query arguments.
	 * @param boolean             $include_total Whether to include the total count in the response.
	 * @return array{items:array<int,string>,totalCount:int}|array<int,string>
	 */
	public function post_type_selectlist_query( $post_type, $args = [], $include_total = false ) {
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

		// $post_type should always be single string?
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
				/**
				 * The post object.
				 *
				 * @var \WP_Post $post
				 */
				$posts[ $post->ID ] = $post->post_title;
			}

			$results = [
				'items'      => $posts,
				'totalCount' => $query->found_posts,
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
	 * @param string              $taxonomy Taxonomy(s) to query.
	 * @param array<string,mixed> $args   Query arguments.
	 * @param boolean             $include_total Whether to include the total count in the response.
	 * @return array{items:array<int,string>,totalCount:int}|array<int,string>
	 */
	public function taxonomy_selectlist_query( $taxonomy, $args = [], $include_total = false ) {
		if ( empty( $taxonomy ) ) {
			$taxonomy = [ 'category' ];
		}

		$args = wp_parse_args( $args, [
			'hide_empty' => false,
			'number'     => 10,
			'search'     => '',
			'include'    => null,
			'exclude'    => null,
			'offset'     => 0,
			'page'       => null,
			'taxonomy'   => $taxonomy,
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
				'items'      => $terms,
				'totalCount' => $include_total ? get_terms( $total_args ) : null,
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
	 * @param array<string,mixed> $args Query arguments.
	 * @param bool                $include_total Whether to include the total count in the response.
	 *
	 * @return array{items:array<int,string>,totalCount:int}|array<int,string>
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
				'items'      => $users,
				'totalCount' => $query->get_total(),
			];

			$queries[ $key ] = $results;
		} else {
			$results = $queries[ $key ];
		}

		return ! $include_total ? $results['items'] : $results;
	}
}
