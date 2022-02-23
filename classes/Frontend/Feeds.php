<?php
/**
 * Frontend feed setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Frontend;

use function ContentControl\get_plugin_option;

defined( 'ABSPATH' ) || exit;

/**
 * Feed content restriction management.
 */
class Feeds {

	/**
	 * Initiate functionality.
	 */
	public function __construct() {
		add_action( 'the_excerpt', [ $this, 'filter_feed_posts' ] );
		add_action( 'the_content', [ $this, 'filter_feed_posts' ] );
		add_filter( 'content_control_restricted_message', [ $this, 'restricted_message_filter' ], 10, 1 );
	}

	/**
	 * Filter feed post content when needed.
	 *
	 * @param string $content Content of post being checked.
	 *
	 * @return string
	 */
	public function filter_feed_posts( $content ) {
		global $post;

		if ( ! is_feed() ) {
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
			$message = get_plugin_option( 'default_denial_message', '' );
			// custom messages could include shortcodes.
		}

		if ( empty( $message ) ) {
			$message = __( 'This content is restricted.', 'content-control' );
		}

		return Posts::format_message( do_shortcode( $message ) );
	}

	/**
	 * Filter restricted message for shortcodes.
	 *
	 * @param string $message Message to be filtered.
	 * @return string
	 */
	public function restricted_message_filter( $message ) {
		if ( ! is_feed() ) {
			return $message;
		}

		return do_shortcode( $message );
	}

}
