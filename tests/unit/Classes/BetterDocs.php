<?php
/**
 * BetterDocs compatibility tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Classes;

use Brain\Monkey\Functions;
use ContentControl\Controllers\Compatibility\BetterDocs as BetterDocsController;
use ContentControl\Tests\PluginTestCase;

/**
 * BetterDocs compatibility behavior.
 */
class BetterDocs extends PluginTestCase {

	/**
	 * Forced post-type delimiters are preserved until each value is sanitized.
	 */
	public function test_forced_post_types_are_split_before_key_sanitization() {
		global $wp;

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Test fixture for WordPress request state.
		$wp                    = (object) [ 'query_vars' => [ 'rest_route' => '/wp/v2/search' ] ];
		$_REQUEST['post_type'] = 'ct_forced_docs:page';

		Functions\when( 'wp_unslash' )->returnArg();
		Functions\when( 'sanitize_text_field' )->returnArg();
		Functions\when( 'sanitize_key' )->alias( static function ( $value ) {
			return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( $value ) );
		} );

		$controller = new BetterDocsController( new \stdClass() );
		$intent     = $controller->get_rest_api_intent( [
			'type' => 'unknown',
			'name' => 'search',
		] );

		$this->assertSame( 'post_type', $intent['type'] );
		$this->assertSame( [ 'docs', 'page' ], $intent['name'] );
	}

	/**
	 * Clear request globals changed by the test.
	 */
	protected function tearDown(): void {
		unset( $_REQUEST['post_type'] );
		parent::tearDown();
	}
}
