<?php
/**
 * Frontend post content restrictions.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend\Restrictions;

use ContentControl\Base\Controller;

use function ContentControl\content_is_restricted;
use function ContentControl\protection_is_disabled;
use function ContentControl\get_applicable_restriction;

defined( 'ABSPATH' ) || exit;

/**
 * Class for handling global restrictions of the post contents.
 *
 * @package ContentControl
 */
class PostContent extends Controller {

	/**
	 * Initiate functionality.
	 */
	public function init() {
		add_filter( 'the_content', [ $this, 'filter_the_content_if_restricted' ], 1000 );
		add_filter( 'get_the_excerpt', [ $this, 'filter_the_excerpt_if_restricted' ], 1000, 2 );

		// phpcs:disable Squiz.PHP.CommentedOutCode.Found, Squiz.Commenting.InlineComment.InvalidEndChar -- These are for future use.
		// add_filter( 'the_title', [ $this, 'filter_the_title_if_restricted'], 1000, 2 );
		// add_filter( 'get_the_excerpt', [ $this, 'filter_the_excerpt_if_restricted' ], 1000, 2 );
		// add_filter( 'post_class', [ $this, 'filter_post_class_if_restricted' ], 1000, 3 );
		// add_filter( 'post_password_required', [ $this, 'require_password_if_restricted' ], 1000, 2 );
		// add_filter( 'the_password_form', [ $this, 'filter_password_form_if_restricted' ], 1000, 2 );
		// phpcs:enable Squiz.PHP.CommentedOutCode.Found, Squiz.Commenting.InlineComment.InvalidEndChar
	}

	/**
	 * Filter post content when needed.
	 *
	 * @param string $content Content of post being checked.
	 *
	 * @return string
	 */
	public function filter_the_content_if_restricted( $content ) {
		$filter_name = 'content_control/restricted_post_content';

		// Ensure we don't get into an infinite loop.
		if ( doing_filter( $filter_name ) || doing_filter( 'get_the_excerpt' ) ) {
			return $content;
		}

		// If this isn't a post type that can be restricted, bail.
		if ( protection_is_disabled() ) {
			return $content;
		}

		if ( ! content_is_restricted() ) {
			return $content;
		}

		$restriction = get_applicable_restriction();

		// If this is a replacement page, bail.
		if (
			( 'replace' === $restriction->protection_method && 'page' === $restriction->replacement_type && is_page( $restriction->replacement_page ) ) ||
			( 'replace_archive_page' === $restriction->archive_handling && is_page( $restriction->archive_replacement_page ) )
		) {
			return $content;
		}

		/**
		 * Filter the message to display when a post is restricted.
		 *
		 * @param string $message     Message to display.
		 * @param object $restriction Restriction object.
		 *
		 * @return string
		 */
		return apply_filters(
			$filter_name,
			$restriction->get_message(),
			$restriction
		);
	}

	/**
	 * Filter post excerpt when needed.
	 *
	 * @param string  $post_excerpt The post excerpt.
	 * @param WP_Post $post         Post object.
	 *
	 * @return string
	 */
	public function filter_the_excerpt_if_restricted( $post_excerpt, $post ) {
		$filter_name = 'content_control/restricted_post_excerpt';

		if ( doing_filter( $filter_name ) ) {
			return $post_excerpt;
		}

		// If this isn't a post type that can be restricted, bail.
		if ( protection_is_disabled() ) {
			return $post_excerpt;
		}

		if ( ! content_is_restricted( $post->ID ) ) {
			return $post_excerpt;
		}

		$restriction = get_applicable_restriction();

		/**
		 * Filter the excerpt to display when a post is restricted.
		 *
		 * @param string $message     Message to display.
		 * @param object $restriction Restriction object.
		 *
		 * @return string
		 */
		return apply_filters(
			$filter_name,
			$restriction->get_message(),
			$restriction
		);
	}
}
