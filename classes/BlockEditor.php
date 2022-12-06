<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl;

use ContentControl\Base\Controller;
use function ContentControl\plugin;

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
		add_action( 'enqueue_block_editor_assets', [ $this, 'register_editor_assets' ] );
		add_action( 'enqueue_block_assets', [ $this, 'register_block_assets' ] );
	}

	/**
	 * Get asset meta from generated files.
	 *
	 * @return array
	 */
	public function get_asset_meta() {
		$meta_path = 'dist/block-editor.asset.php';
		return file_exists( plugin( 'path' ) . $meta_path ) ? require plugin( 'path' ) . $meta_path : [
			'dependencies' => [],
			'version'      => plugin( 'version' ),
		];
	}

	/**
	 * Registers all block assets so that they can be enqueued through Gutenberg in
	 * the corresponding context.
	 *
	 * Passes translations to JavaScript.
	 *
	 * This uses the generated php file from @wordpress/scripts webpack builds.
	 */
	public function register_editor_assets() {
		$handle = 'content-control-block-editor';

		wp_enqueue_script( $handle );

		/**
		 * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
		 * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
		 * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
		 */
		wp_set_script_translations( $handle, 'content-control' );
	}

	/**
	 * Register block assets.
	 *
	 * This uses the generated php file from @wordpress/scripts webpack builds.
	 */
	public function register_block_assets() {
		$meta = $this->get_asset_meta();

		wp_enqueue_style( 'content-control-block-styles', plugin()->get_url( 'dist/style-block-editor.css' ), [], $meta['version'] );
	}

}
