<?php
/**
 * Frontend post setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend;

use ContentControl\Base\Controller;

use function ContentControl\content_is_restricted;
use function ContentControl\protection_is_disabled;

defined( 'ABSPATH' ) || exit;

/**
 * Class Posts
 *
 * @package ContentControl
 */
class Posts extends Controller {

	/**
	 * Initiate functionality.
	 */
	public function init() {
		if ( \ContentControl\is_rest() || is_admin() ) {
			return;
		}

		add_action( 'the_content', [ $this, 'the_content' ], 1000 );
	}

	/**
	 * Filter post content when needed.
	 *
	 * @param string $content Content of post being checked.
	 *
	 * @return string
	 */
	public function the_content( $content ) {
		global $post;

		// If this isn't a post type that can be restricted, bail.
		if ( ! $post || ! is_object( $post ) || $post->ID <= 0 ) {
			return $content;
		}

		if ( protection_is_disabled() ) {
			return $content;
		}

		if ( ! content_is_restricted() ) {
			return $content;
		}

		$restriction = $this->container->get( 'restrictions' )->get_applicable_restriction();

		return apply_filters(
			'content_control/feed_restricted_message',
			$restriction->get_message(),
			$restriction
		);
	}

}
