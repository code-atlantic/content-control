<?php

namespace ContentControl;

use ContentControl\Base\Controller;

class Restrictions extends Controller {

	/**
	 * Init controller.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'init', [ $this, 'register_post_type' ] );
		add_action( 'init', [ $this, 'register_rest_fields' ] );
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
			'supports'            => [ 'title' ],
			'show_in_graphql'     => false,
			'capabilities'        => [
				'create_posts' => plugin()->get_permission( 'edit_restrictions' ),
				'edit_posts'   => plugin()->get_permission( 'edit_restrictions' ),
				'delete_posts' => plugin()->get_permission( 'edit_restrictions' ),
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
		register_rest_field( 'cc_restriction', 'title', [
			'get_callback'    => function ( $object ) {
				return get_the_title( $object['id'] );
			},
			'update_callback' => function ( $value, $object ) {
				wp_update_post( [
					'ID'         => $object->ID,
					'post_title' => sanitize_text_field( $value ),
				] );
			},
		] );

		register_rest_field( 'cc_restriction', 'description', [
			'get_callback'    => function ( $object ) {
				return get_the_excerpt( $object['id'] );
			},
			'update_callback' => function ( $value, $object ) {
				wp_update_post( [
					'ID'           => $object->ID,
					'post_excerpt' => sanitize_text_field( $value ),
				] );
			},
		] );

		register_rest_field( 'cc_restriction', 'settings', [
			'get_callback'    => function ( $object ) {
				return get_post_meta( $object['id'], 'restriction_settings', true );
			},
			'update_callback' => function ( $value, $object ) {
				// Update the field/meta value.
				update_post_meta( $object->ID, 'restriction_settings', $value );
			},
			'permission_callback' => function () {
				return current_user_can( plugin()->get_permission( 'edit_restrictions' ) );
			},
		] );
	}
}
