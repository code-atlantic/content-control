<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;

defined( 'ABSPATH' ) || exit;

/**
 * Class BlockEditor
 *
 * @version 2.0.0
 */
class BlockEditor extends Controller {

	/**
	 * Initiate hooks & filter.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_assets' ] );
		add_action( 'enqueue_block_assets', [ $this, 'enqueue_block_assets' ] );
	}

	/**
	 * Enqueue block editor assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		wp_enqueue_script( 'content-control-block-editor' );
	}

	/**
	 * Enqueue block assets.
	 *
	 * @return void
	 */
	public function enqueue_block_assets() {
		wp_enqueue_style( 'content-control-block-styles' );
	}
}
