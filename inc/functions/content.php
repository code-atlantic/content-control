<?php
/**
 * Content helper functions.
 *
 * @package ContentControl
 * @since 2.0.0
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl;

/**
 * Get excerpt by post.
 *
 * @param int|object $post Post to get excerpt for.
 * @param integer    $length Length.
 * @param string     $tags Allowed html tags.
 * @param string     $extra Appended more text string...
 * @return string|false
 */
function excerpt_by_id( $post, $length = 50, $tags = '<a><em><strong><blockquote><ul><ol><li><p>', $extra = ' . . .' ) {
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

/**
 * Filter feed post content when needed.
 *
 * @param string                             $content Content to display.
 * @param \ContentControl\Models\Restriction $restriction Restriction object.
 *
 * @return string
 */
function append_post_excerpts( $content, $restriction ) {
	global $post;

	if ( $restriction->show_excerpts() ) {
		$excerpt_length = apply_filters( 'content_control/excerpt_length', 50 );

		$excerpt = excerpt_by_id( $post, $excerpt_length );
		$content = $excerpt . $content;
	}

	return $content;
}


if ( ! function_exists( 'get_current_page_url' ) ) {
	/**
	 * Get the current page URL.
	 *
	 * @return string
	 */
	function get_current_page_url() {
		global $wp;
		/* phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotValidated, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash */
		return add_query_arg( $_SERVER['QUERY_STRING'], '', home_url( $wp->request ) );
		/* phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotValidated, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash */
	}
}

if ( ! function_exists( 'the_current_page_url' ) ) {
	/**
	 * Output the current page URL
	 *
	 * @return void
	 */
	function the_current_page_url() {
		echo esc_url_raw( get_current_page_url() );
	}
}
