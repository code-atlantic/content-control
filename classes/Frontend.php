<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl;

use ContentControl\Interfaces\Controller;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend
 */
class Frontend extends Controller {

	/**
	 * Initialize Hooks & Filters
	 */
	public function init() {
		add_filter( 'pre_render_block', [ $this, 'pre_render_block' ], 10, 3 );

		new Frontend\Posts();
		new Frontend\Feeds();
		new Frontend\Widgets();
		new Frontend\Restrictions();
	}

	/**
	 * Short curcuit block rendering for hidden blocks.
	 *
	 * @param string|null   $pre_render   The pre-rendered content. Default null.
	 * @param array         $parsed_block The block being rendered.
	 * @param WP_Block|null $parent_block If this is a nested block, a reference to the parent block.
	 *
	 * @return string|null
	 */
	public function pre_render_block( $pre_render, $parsed_block, $parent_block ) {
		return $pre_render;
	}

}
