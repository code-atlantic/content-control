<?php
/**
 * Block controller tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Classes;

use Brain\Monkey\Functions;
use ContentControl\Controllers\Frontend\Blocks as BlocksController;
use ContentControl\Tests\PluginTestCase;

/**
 * Frontend block behavior.
 */
class Blocks extends PluginTestCase {

	/**
	 * Inline styles preserve valid HTML-like CSS syntax.
	 */
	public function test_inline_styles_preserve_svg_data_uris() {
		$container  = new class() {
			public function get( $key ) {
				return 'version' === $key ? '2.7.0' : null;
			}
		};
		$controller = new class( $container ) extends BlocksController {
			public function enqueue_styles( $styles ) {
				$this->enqueue_block_styles( $styles );
			}
		};
		$styles     = '.icon { background-image: url("data:image/svg+xml,<svg viewBox=\'0 0 1 1\'></svg>"); }';

		Functions\expect( 'wp_register_style' )
			->once()
			->with( 'content-control-block-styles', false, [], '2.7.0' );
		Functions\expect( 'wp_enqueue_style' )
			->once()
			->with( 'content-control-block-styles' );
		Functions\expect( 'wp_add_inline_style' )
			->once()
			->with( 'content-control-block-styles', $styles );

		$controller->enqueue_styles( $styles );
	}
}
