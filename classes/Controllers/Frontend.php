<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;

use ContentControl\Controllers\Frontend\Blocks;
use ContentControl\Controllers\Frontend\Restrictions;
use ContentControl\Controllers\Frontend\Widgets;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend
 */
class Frontend extends Controller {

	/**
	 * Initialize Hooks & Filters
	 */
	public function init() {
		$this->container->register_controllers([
			'Frontend\Blocks'       => new Blocks( $this->container ),
			'Frontend\Restrictions' => new Restrictions( $this->container ),
			'Frontend\Widgets'      => new Widgets( $this->container ),
		]);

		$this->hooks();
	}

	/**
	 * Register general frontend hooks.
	 *
	 * @return void
	 */
	public function hooks() {
		add_filter( 'content_control/restricted_post_content', '\ContentControl\append_post_excerpts', 9, 2 );
		add_filter( 'content_control/restricted_post_content', '\ContentControl\the_content_filters', 10 );

		add_filter( 'content_control/restricted_post_excerpt', '\ContentControl\append_post_excerpts', 9, 2 );
		add_filter( 'content_control/restricted_post_excerpt', '\ContentControl\the_excerpt_filters', 10 );
	}
}
