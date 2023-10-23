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
 * Get post excerpt or <!--more--> tag content for a post.
 *
 * This differs from get_the_excerpt in that it will return the content
 * before the <!--more--> tag if it exists, but not generate an excerpt
 * from the_contnet. It also doesn't filter the content.
 *
 * @param int|\WP_Post|null $post_id Post ID or object. Defaults to global $post.
 * @return string
 */
function get_excerpt_by_id( $post_id = null ) {
	$post = get_post( $post_id );

	$excerpt = '';

	if ( $post ) {
		if ( has_excerpt( $post ) ) {
			// Use the excerpt if it's set.
			$excerpt = $post->post_excerpt;
		} else {
			// Otherwise, use the content before the 'more' tag.
			$content       = $post->post_content;
			$more_position = strpos( $content, '<!--more-->' );
			if ( false !== $more_position ) {
				// If there's a 'more' tag, return everything before it.
				$excerpt = substr( $content, 0, $more_position );
			}
		}
	}

	return $excerpt;
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

		// Get unfiltered excerpt.
		$excerpt = get_excerpt_by_id( $post );

		if ( ! empty( $excerpt ) ) {
			/**
			 * Filter the allowed tags for excerpts.
			 *
			 * @param string $tags Allowed tags.
			 *
			 * @return string
			 */
			$tags = apply_filters(
				'content_control/excerpt_allowed_tags',
				'<a><em><strong><blockquote><ul><ol><li><p>'
			);

			// Strip tags from excerpt.
			$excerpt = wp_kses( $excerpt, $tags );

			// Wrap excerpt in div with class.
			$excerpt = '<div class="cc-content-excerpt">' . $excerpt . '</div>';

			// Prepend excerpt to content.
			$content = $excerpt . $content;
		}
	}

	return $content;
}

/**
 * Apply content filters for the_content without our own again.
 *
 * @param string $content Content to display.
 *
 * @return string
 */
function the_content_filters( $content ) {
	return apply_filters( 'the_content', $content );
}

/**
 * Apply get_the_excerpt fitlers without our own again.
 *
 * @param string $excerpt Excerpt to display.
 *
 * @return string
 */
function the_excerpt_filters( $excerpt ) {
	global $post;
	return apply_filters( 'get_the_excerpt', $excerpt, $post );
}

/**
 * Get the current page URL.
 *
 * @return string
 */
function get_current_page_url() {
	global $wp;

	$current_page = trailingslashit( home_url( $wp->request ) );

	/* phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotValidated, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash */
	return add_query_arg( $_SERVER['QUERY_STRING'], '', $current_page );
	/* phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotValidated, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash */
}
