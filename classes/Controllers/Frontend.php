<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;
use ContentControl\RuleEngine\Handler;

use ContentControl\Controllers\Frontend\Blocks;
use ContentControl\Controllers\Frontend\Feeds;
use ContentControl\Frontend\Widgets;
use ContentControl\Frontend\Posts;
use ContentControl\Frontend\Restrictions;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend
 */
class Frontend extends Controller {

	/**
	 * Initialize Hooks & Filters
	 */
	public function init() {
		$controllers = [
			'Frontend\Blocks'  => new Blocks( $this->container ),
			'Frontend\Feeds'   => new Feeds( $this->container ),
			'Frontend\Widgets' => new Widgets( $this->container ),
		];

		foreach ( $controllers as $controller ) {
			if ( $controller instanceof Controller ) {
				$controller->init();
			}
		}

		$this->hooks();
		new Posts();
		new Restrictions();
	}

	/**
	 * Register general frontend hooks.
	 *
	 * @return void
	 */
	public function hooks() {
		add_filter( 'content_control/feed_restricted_message', [ $this, 'append_post_excerpts' ], 10, 2 );
		add_filter( 'content_control/feed_restricted_message', [ $this, 'process_shortcodes' ], 10, 2 );
	}

	/**
	 * Filter feed post content when needed.
	 *
	 * @param string                             $content Content to display.
	 * @param \ContentControl\Models\Restriction $restriction Restriction object.
	 *
	 * @return string
	 */
	public function append_post_excerpts( $content, $restriction ) {
		global $post;

		if ( $restriction->show_excerpts() ) {
			$excerpt_length = apply_filters( 'content_control/excerpt_length', 50 );

			$excerpt = \ContentControl\excerpt_by_id( $post, $excerpt_length );
			$content = $excerpt . $content;
		}

		return $content;
	}

	/**
	 * Process shortcodes.
	 *
	 * @param string $content Content to process.
	 * @return string
	 */
	public function process_shortcodes( $content ) {
		return do_shortcode( $content );
	}
}
