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

		$option_key = isset( $_POST["key"] ) ? $_POST["key"] : false;
		$option_value = isset( $_POST["value"] ) ? $_POST["value"] : null;

		if( wp_verify_nonce( $nonce, 'jp-cc-admin-nonce' ) && isset( $option_value ) ) {

			if ( $option_key && ! empty( $option_key ) ) {
				Options::update( $option_key, $option_value );
			} else {
				wp_send_json_error( "No option key was passed." );
			}

		} else {
			// If the nonce was invalid or the comment was empty, send an error.
			wp_send_json_error( "This came from the wrong place" );
		}

		wp_send_json_success($option_value);
	}

	public static function object_search() {
		$results = array(
			'items'       => array(),
			'total_count' => 0,
		);
		switch ( $_REQUEST['object_type'] ) {
			case 'post_type':
				$post_type = ! empty( $_REQUEST['object_key'] ) ? $_REQUEST['object_key'] : 'post';
				$args      = array(
					's'              => ! empty( $_REQUEST['s'] ) ? $_REQUEST['s'] : null,
					'post__in'       => ! empty( $_REQUEST['include'] ) ? array_map( 'intval', $_REQUEST['include'] ) : null,
					'page'           => ! empty( $_REQUEST['page'] ) ? absint( $_REQUEST['page'] ) : null,
					'posts_per_page' => 10,
				);
				$query = Helpers::post_type_selectlist( $post_type, $args, true );
				foreach ( $query['items'] as $name => $id ) {
					$results['items'][] = array(
						'id'   => $id,
						'text' => $name,
					);
				}
				$results['total_count'] = $query['total_count'];
				break;
			case 'taxonomy':
				$taxonomy = ! empty( $_REQUEST['object_key'] ) ? $_REQUEST['object_key'] : 'category';
				$args = array(
					'search'  => ! empty( $_REQUEST['s'] ) ? $_REQUEST['s'] : '',
					'include' => ! empty( $_REQUEST['include'] ) ? $_REQUEST['include'] : null,
					'page'    => ! empty( $_REQUEST['page'] ) ? absint( $_REQUEST['page'] ) : null,
					'number'  => 10,
				);
				$query = Helpers::taxonomy_selectlist( $taxonomy, $args, true );
				foreach ( $query['items'] as $name => $id ) {
					$results['items'][] = array(
						'id'   => $id,
						'text' => $name,
					);
				}
				$results['total_count'] = $query['total_count'];
				break;
		}
		echo json_encode( $results );
		die();
	}

}
