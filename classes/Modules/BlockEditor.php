<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Modules;

use ContentControl\Interfaces\Controller;
use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Class BlockEditor
 */
class BlockEditor implements Controller {

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
	 * Registers all block assets so that they can be enqueued through Gutenberg in
	 * the corresponding context.
	 *
	 * Passes translations to JavaScript.
	 *
	 * This uses the generated php file from @wordpress/scripts webpack builds.
	 */
	public function register_editor_assets() {
		$script_path       = 'build/block-editor.js';
		$script_asset_path = 'build/block-editor.asset.php';
		$script_asset      = file_exists( plugin( 'path' ) . $script_asset_path ) ? require plugin( 'path' ) . $script_asset_path : [
			'dependencies' => [],
			'version'      => filemtime( plugin( 'path' ) . $script_path ),
		];
		$script_url        = plugins_url( $script_path, plugin( 'file' ) );
		wp_enqueue_script( 'content-control-block-editor', $script_url, array_merge( $script_asset['dependencies'], [ 'wp-edit-post' ] ), $script_asset['version'] );

		wp_localize_script( 'content-control-block-editor', 'content_control_block_editor_vars', [] );

		$editor_styles_path       = 'build/block-editor-styles.css';
		$editor_styles_asset_path = 'build/block-editor-styles.asset.php';
		$editor_styles_asset      = file_exists( plugin( 'path' ) . $editor_styles_asset_path ) ? require plugin( 'path' ) . $editor_styles_asset_path : [
			'dependencies' => [],
			'version'      => filemtime( plugin( 'path' ) . $editor_styles_path ),
		];
		wp_enqueue_style( 'content-control-editor-styles', plugins_url( $editor_styles_path, plugin( 'file' ) ), [], $editor_styles_asset['version'] );

		if ( function_exists( 'wp_set_script_translations' ) ) {
			/**
			 * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
			 * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
			 * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
			 */
			wp_set_script_translations( 'content-control', 'content-control' );
		}
	}


	/**
	 * Register block assets.
	 *
	 * This uses the generated php file from @wordpress/scripts webpack builds.
	 */
	public function register_block_assets() {
		$block_styles_path       = 'build/block-styles.css';
		$block_styles_asset_path = 'build/block-styles.asset.php';
		$block_styles_asset      = file_exists( plugin( 'path' ) . $block_styles_asset_path ) ? require plugin( 'path' ) . $block_styles_asset_path : [
			'dependencies' => [],
			'version'      => filemtime( plugin( 'path' ) . $block_styles_path ),
		];
		wp_enqueue_style( 'content-control-block-styles', plugins_url( $block_styles_path, plugin( 'file' ) ), [], $block_styles_asset['version'] );
	}

}
