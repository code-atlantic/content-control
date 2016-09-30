<?php


namespace JP\CC\Site;

use JP\CC\Options;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Posts {

	public static function init() {
		add_action( 'the_content', array( __CLASS__, 'the_content' ), 1000 );
		add_filter( 'jp_cc_restricted_message', array( __CLASS__, 'restricted_message_filter' ), 10, 1 );
	}

	public static function the_content( $content ) {
		global $post;

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

		return static::format_message( $message );
	}

	public static function restricted_message_filter( $message ) {
		if ( is_feed() ) {
			return $message;
		}
		return do_shortcode( wpautop( $message ) );
	}

	public static function format_message( $message ) {
		global $post;

		$restriction = Restrictions::get_rules( $post->ID );

		if ( ! empty( $restriction['show_excerpts'] ) ) {
			$excerpt_length = 50;

			if ( has_filter( 'jp_cc_filter_excerpt_length' ) ) {
				$excerpt_length = apply_filters( 'jp_cc_filter_excerpt_length', $excerpt_length );
			}

			$excerpt = static::excerpt_by_id( $post, $excerpt_length );
			$message = apply_filters( 'jp_cc_restricted_message', $message );
			$message = $excerpt . $message;
		} else {
			$message = apply_filters( 'jp_cc_restricted_message', $message );
		}

		return $message;
	}

	public static function excerpt_by_id( $post, $length = 50, $tags = '<a><em><strong><blockquote><ul><ol><li><p>', $extra = ' . . .' ) {
		if ( is_int( $post ) ) {
			// get the post object of the passed ID
			$post = get_post( $post );
		} elseif ( ! is_object( $post ) ) {
			return false;
		}

		$more = false;

		if ( has_excerpt( $post->ID ) ) {
			$the_excerpt = $post->post_excerpt;
		} elseif ( strstr( $post->post_content, '<!--more-->' ) ) {
			$more        = true;
			$length      = strpos( $post->post_content, '<!--more-->' );
			$the_excerpt = $post->post_content;
		} else {
			$the_excerpt = $post->post_content;
		}

		$tags = apply_filters( 'jp_cc_excerpt_tags', $tags );

		if ( $more ) {
			$the_excerpt = strip_shortcodes( strip_tags( stripslashes( substr( $the_excerpt, 0, $length ) ), $tags ) );
		} else {
			$the_excerpt   = strip_shortcodes( strip_tags( stripslashes( $the_excerpt ), $tags ) );
			$the_excerpt   = preg_split( '/\b/', $the_excerpt, $length * 2 + 1 );
			$excerpt_waste = array_pop( $the_excerpt );
			$the_excerpt   = implode( $the_excerpt );
			$the_excerpt .= $extra;
		}

		return wpautop( $the_excerpt );
	}

}
