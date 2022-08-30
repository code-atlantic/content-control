<?php
/**
 * Frontend post setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Frontend;

use function ContentControl\get_plugin_option;

defined( 'ABSPATH' ) || exit;

/**
 * Class Posts
 *
 * @package ContentControl\Frontend
 */
class Posts {

	/**
	 * Initiate functionality.
	 */
	public function __construct() {
		if ( \ContentControl\is_rest() ) {
			return;
		}

		if ( ! is_admin() ) {
			add_action( 'the_content', [ $this, 'the_content' ], 1000 );
		}
		add_filter( 'content_control_restricted_message', [ $this, 'restricted_message_filter' ], 10, 1 );
	}

	/**
	 * Check if protection methods should be disabled.
	 *
	 * @return bool
	 */
	public function protection_disabled() {
		$checks = [
			is_preview() && current_user_can( 'edit_post', get_the_ID() ),
			did_action( 'elementor/loaded' ) && class_exists( '\Elementor\Plugin' ) && isset( \Elementor\Plugin::$instance ) && isset( \Elementor\Plugin::$instance->preview ) && method_exists( \Elementor\Plugin::$instance->preview, 'is_preview_mode' ) && \Elementor\Plugin::$instance->preview->is_preview_mode(),
		];

		return in_array( true, $checks, true );
	}

	/**
	 * Filter post content when needed.
	 *
	 * @param string $content Content of post being checked.
	 *
	 * @return string
	 */
	public function the_content( $content ) {
		if ( $this->protection_disabled() ) {
			return $content;
		}

		global $post;

		if ( ! $post || ! is_object( $post ) || $post->ID <= 0 ) {
			return $content;
		}

		if ( ! isset( Restrictions::$protected_posts[ $post->ID ] ) ) {
			Restrictions::instance()->protected_posts[ $post->ID ] = Restrictions::instance()->restricted_content();
		}

		$restricted_content = Restrictions::instance()->protected_posts[ $post->ID ];

		if ( ! $restricted_content ) {
			return $content;
		}

		if ( isset( $restricted_content['override_default_message'] ) ) {
			$message = $restricted_content['custom_message'];
		} else {
			$message = \ContentControl\get_option( 'default_denial_message', '' );
		}

		if ( empty( $message ) ) {
			$message = __( 'This content is restricted.', 'content-control' );
		}

		return $this->format_message( do_shortcode( $message ) );
	}

	/**
	 * Filter restricted message for shortcodes.
	 *
	 * @param string $message Message to be filtered.
	 * @return string
	 */
	public function restricted_message_filter( $message ) {
		if ( is_feed() ) {
			return $message;
		}
		return do_shortcode( wpautop( $message ) );
	}

	/**
	 * Format restricted message..
	 *
	 * @param string $message Message to be formatted..
	 * @return string
	 */
	public function format_message( $message ) {
		global $post;

		$restriction = Restrictions::instance()->get_rules( $post->ID );

		if ( ! empty( $restriction['show_excerpts'] ) ) {
			$excerpt_length = apply_filters( 'content_control_excerpt_length', 50 );

			$excerpt = $this->excerpt_by_id( $post, $excerpt_length );
			$message = apply_filters( 'content_control_restricted_message', $message );
			$message = $excerpt . $message;
		} else {
			$message = apply_filters( 'content_control_restricted_message', $message );
		}

		return $message;
	}

	/**
	 * Get excerpt by post.
	 *
	 * @param int|object $post Post to get excerpt for.
	 * @param integer    $length Length.
	 * @param string     $tags Allowed html tags.
	 * @param string     $extra Appended more text string...
	 * @return string|false
	 */
	public function excerpt_by_id( $post, $length = 50, $tags = '<a><em><strong><blockquote><ul><ol><li><p>', $extra = ' . . .' ) {
		if ( is_int( $post ) ) {
			// get the post object of the passed ID.
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

		if ( $more ) {
			$the_excerpt = strip_shortcodes( strip_tags( stripslashes( substr( $the_excerpt, 0, $length ) ), $tags ) );
		} else {
			$the_excerpt   = strip_shortcodes( strip_tags( stripslashes( $the_excerpt ), $tags ) );
			$the_excerpt   = preg_split( '/\b/', $the_excerpt, $length * 2 + 1 );
			$excerpt_waste = array_pop( $the_excerpt );
			$the_excerpt   = implode( $the_excerpt );
			$the_excerpt  .= $extra;
		}

		return wpautop( $the_excerpt );
	}

}
