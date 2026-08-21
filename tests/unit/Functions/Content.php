<?php
/**
 * Content function tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Functions;

use Brain\Monkey\Functions;
use ContentControl\Tests\PluginTestCase;
use Mockery;

use function ContentControl\get_current_page_url;

/**
 * Content helper behavior.
 */
class Content extends PluginTestCase {

	/**
	 * Encoded query values are decoded before their values are sanitized.
	 */
	public function test_current_page_url_preserves_percent_encoded_query_values() {
		global $wp;

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Test fixture for WordPress request state.
		$wp                      = (object) [ 'request' => 'search' ];
		$_SERVER['QUERY_STRING'] = 's=hello%20world&filter%5Bstatus%5D=published';

		Functions\when( 'home_url' )->alias( static function ( $path ) {
			return 'https://example.com/' . ltrim( $path, '/' );
		} );
		Functions\when( 'trailingslashit' )->alias( static function ( $url ) {
			return rtrim( $url, '/' ) . '/';
		} );
		Functions\when( 'wp_unslash' )->returnArg();
		Functions\when( 'sanitize_text_field' )->alias( static function ( $value ) {
			return preg_replace( '/%[a-f0-9]{2}/i', '', $value );
		} );
		Functions\expect( 'wp_parse_str' )
			->once()
			->with(
				's=hello%20world&filter%5Bstatus%5D=published',
				Mockery::type( 'array' )
			);
		Functions\when( 'map_deep' )->alias( static function ( $values, $callback ) {
			$sanitize = static function ( $value ) use ( &$sanitize, $callback ) {
				if ( is_array( $value ) ) {
					return array_map( $sanitize, $value );
				}

				return $callback( $value );
			};

			return $sanitize( $values );
		} );
		Functions\when( 'add_query_arg' )->alias( static function ( $args, $url ) {
			return $url . '?' . http_build_query( $args );
		} );

		$this->assertSame( 'https://example.com/search/?', get_current_page_url() );
	}

	/**
	 * Clear request globals changed by the test.
	 */
	protected function tearDown(): void {
		unset( $_SERVER['QUERY_STRING'] );
		parent::tearDown();
	}
}
