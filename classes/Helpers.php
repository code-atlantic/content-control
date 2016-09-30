<?php


namespace JP\CC;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Helpers {

	public static function object_to_array( $object ) {
		$array = array();
		foreach ( (array) $object as $key => $value ) {
			$array[ $key ] = is_object( $value ) || is_array( $value ) ? self::object_to_array( $value ) : $value;
		}

		return $array;
	}

	public static function post_type_selectlist( $post_type, $args = array(), $include_total = false ) {

		$args = wp_parse_args( $args, array(
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
		) );

		if ( $post_type == 'attachment' ) {
			$args['post_status'] = 'inherit';
		}

		// Query Caching.
		static $queries = array();

		$key = md5( serialize( $args ) );

		if ( ! isset( $queries[ $key ] ) ) {
			$query = new \WP_Query( $args );

			$posts = array();
			foreach ( $query->posts as $post ) {
				$posts[ $post->post_title ] = $post->ID;
			}

			$results = array(
				'items'       => $posts,
				'total_count' => $query->found_posts,
			);

			$queries[ $key ] = $results;
		} else {
			$results = $queries[ $key ];
		}

		return ! $include_total ? $results['items'] : $results;
	}

	public static function taxonomy_selectlist( $taxonomies = array(), $args = array(), $include_total = false ) {
		if ( empty ( $taxonomies ) ) {
			$taxonomies = array( 'category' );
		}

		$args = wp_parse_args( $args, array(
			'hide_empty' => false,
			'number'     => 10,
			'search'     => '',
			'include'    => null,
			'offset'     => 0,
			'page'       => null,
		) );

		if ( $args['page'] ) {
			$args['offset'] = ( $args['page'] - 1 ) * $args['number'];
		}

		// Query Caching.
		static $queries = array();

		$key = md5( serialize( $args ) );

		if ( ! isset( $queries[ $key ] ) ) {
			$terms = array();

			foreach ( get_terms( $taxonomies, $args ) as $term ) {
				$terms[ $term->name ] = $term->term_id;
			}

			$total_args = $args;
			unset( $total_args['number'] );
			unset( $total_args['offset'] );

			$results = array(
				'items'       => $terms,
				'total_count' => $include_total ? wp_count_terms( $taxonomies, $total_args ) : null,
			);

			$queries[ $key ] = $results;
		} else {
			$results = $queries[ $key ];
		}

		return ! $include_total ? $results['items'] : $results;
	}

	public static function is_customize_preview() {
		global $wp_customize;

		return ( $wp_customize instanceof WP_Customize_Manager ) && $wp_customize->is_preview();
	}

}
