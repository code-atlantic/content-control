<?php


namespace JP\CC\Admin;

use JP\CC\Helpers;
use JP\CC\Options;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Ajax {

	public static function init() {
		add_action( 'wp_ajax_jp_cc_object_search', array( __CLASS__, 'object_search' ) );
		add_action( 'wp_ajax_jp_cc_options_autosave', array( __CLASS__, 'options_autosave' ) );
	}

	public static function options_autosave() {
		// Make sure we have got the data we are expecting.
		$nonce = isset( $_POST["nonce"] ) ? $_POST["nonce"] : "";

		$option_key   = isset( $_POST["key"] ) ? $_POST["key"] : false;
		$option_value = isset( $_POST["value"] ) ? $_POST["value"] : null;

		if ( wp_verify_nonce( $nonce, 'jp-cc-admin-nonce' ) && isset( $option_value ) ) {

			if ( $option_key && ! empty( $option_key ) ) {
				Options::update( $option_key, $option_value );
			} else {
				wp_send_json_error( "No option key was passed." );
			}

		} else {
			// If the nonce was invalid or the comment was empty, send an error.
			wp_send_json_error( "This came from the wrong place" );
		}

		wp_send_json_success( $option_value );
	}

	public static function object_search() {
		$results = array(
			'items'       => array(),
			'total_count' => 0,
		);

		$object_type = sanitize_text_field( $_REQUEST['object_type'] );
		$include     = ! empty( $_REQUEST['include'] ) ? wp_parse_id_list( $_REQUEST['include'] ) : [];
		$exclude     = ! empty( $_REQUEST['exclude'] ) ? wp_parse_id_list( $_REQUEST['exclude'] ) : [];

		if ( ! empty( $include ) ) {
			$exclude = array_merge( $include, $exclude );
		}
		
		switch ( $object_type ) {
			case 'post_type':
				$post_type = ! empty( $_REQUEST['object_key'] ) ? sanitize_text_field( $_REQUEST['object_key'] ) : 'post';

				if ( ! empty( $include ) ) {
					$include_query = Helpers::post_type_selectlist_query(
						$post_type,
						array(
							'post__in'       => $include,
							'posts_per_page' => - 1,
						),
						true
					);

					foreach ( $include_query['items'] as $id => $name ) {
						$results['items'][] = array(
							'id'   => $id,
							'text' => "$name (ID: $id)",
						);
					}

					$results['total_count'] += (int) $include_query['total_count'];
				}

				$query = Helpers::post_type_selectlist_query(
					$post_type,
					array(
						's'              => ! empty( $_REQUEST['s'] ) ? sanitize_text_field( $_REQUEST['s'] ) : null,
						'paged'          => ! empty( $_REQUEST['paged'] ) ? absint( $_REQUEST['paged'] ) : null,
						'post__not_in'   => $exclude,
						'posts_per_page' => 10,
					),
					true
				);

				foreach ( $query['items'] as $id => $name ) {
					$results['items'][] = array(
						'id'   => $id,
						'text' => "$name (ID: $id)",
					);
				}

				$results['total_count'] += (int) $query['total_count'];
				break;

			case 'taxonomy':
				$taxonomy = ! empty( $_REQUEST['object_key'] ) ? sanitize_text_field( $_REQUEST['object_key'] ) : 'category';

				if ( ! empty( $include ) ) {
					$include_query = Helpers::taxonomy_selectlist_query(
						$taxonomy,
						array(
							'include' => $include,
							'number'  => 0,
						),
						true
					);

					foreach ( $include_query['items'] as $id => $name ) {
						$results['items'][] = array(
							'id'   => $id,
							'text' => "$name (ID: $id)",
						);
					}

					$results['total_count'] += (int) $include_query['total_count'];
				}

				$query = Helpers::taxonomy_selectlist_query(
					$taxonomy,
					array(
						'search'  => ! empty( $_REQUEST['s'] ) ? sanitize_text_field( $_REQUEST['s'] ) : null,
						'paged'   => ! empty( $_REQUEST['paged'] ) ? absint( $_REQUEST['paged'] ) : null,
						'exclude' => $exclude,
						'number'  => 10,
					),
					true
				);

				foreach ( $query['items'] as $id => $name ) {
					$results['items'][] = array(
						'id'   => $id,
						'text' => "$name (ID: $id)",
					);
				}

				$results['total_count'] += (int) $query['total_count'];
				break;
            default:
                // Do nothing if object is not post_type or taxonomy.
		}

		// Take out keys which were only used to deduplicate.
		$results['items']       = array_values( $results['items'] );

		echo json_encode( $results );
		die();
	}

}
