<?php


namespace JP\CC\Site;

use JP\CC\Options;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Feeds {

	public static function init() {
		add_action( 'the_excerpt', array( __CLASS__, 'filter_feed_posts' ) );
		add_action( 'the_content', array( __CLASS__, 'filter_feed_posts' ) );
		add_filter( 'jp_cc_restricted_message', array( __CLASS__, 'restricted_message_filter' ), 10, 1 );
	}

	public static function filter_feed_posts( $content ) {
		global $post;

		if( ! is_feed() ) {
			return $content;
		}

		if ( ! isset( Restrictions::$protected_posts[ $post->ID ] ) ) {
			Restrictions::$protected_posts[ $post->ID ] = Restrictions::restricted_content();
		}

		$restricted_content = Restrictions::$protected_posts[ $post->ID ];

		if ( ! $restricted_content ) {
			return $content;
		}

		if ( isset( $restricted_content['override_default_message'] ) ) {
			$message = $restricted_content['custom_message'];
		} else {
			$message = Options::get( 'default_denial_message', '' );
		}

		if ( empty( $message ) ) {
			$message = __( 'This content is restricted.', 'content-control' );
		}

		//return Posts::format_message( $message );
		return Posts::format_message( $message );
	}

	public static function restricted_message_filter( $message ) {
		if ( ! is_feed() ) {
			return $message;
		}
		return do_shortcode( $message );
	}

}
