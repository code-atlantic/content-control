<?php
/**
 * Shortcode controller tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Classes;

use Brain\Monkey;
use Brain\Monkey\Functions;
use ContentControl\Controllers\Shortcodes as ShortcodesController;
use ContentControl\Tests\TestCase;

/**
 * Shortcode controller behavior.
 */
class Shortcodes extends TestCase {

	/**
	 * Set up WordPress function mocks.
	 */
	protected function setUp(): void {
		parent::setUp();
		Monkey\setUp();

		Functions\when( 'shortcode_atts' )->alias(
			static function ( $defaults, $atts ) {
				return array_merge( $defaults, (array) $atts );
			}
		);
		Functions\when( 'wp_validate_boolean' )->alias(
			static function ( $value ) {
				return false === $value || 'false' === strtolower( (string) $value ) ? false : (bool) $value;
			}
		);
		Functions\when( 'ContentControl\user_meets_requirements' )->justReturn( true );
		Functions\when( 'do_shortcode' )->alias( static function ( $value ) {
			return $value;
		} );
		Functions\when( 'wp_kses_post' )->alias( static function ( $value ) {
			unset( $value );
			return '[sanitized]';
		} );
		Functions\when( 'esc_attr' )->alias( static function ( $value ) {
			return $value;
		} );
	}

	/**
	 * Tear down WordPress function mocks.
	 */
	protected function tearDown(): void {
		Monkey\tearDown();
		parent::tearDown();
	}

	/**
	 * The shortcode remains block-level unless inline output is requested.
	 */
	public function test_inline_attribute_controls_container_element() {
		$controller = new ShortcodesController(
			new class() {
				public function get_option( $key, $fallback = '' ) {
					unset( $key );
					return $fallback;
				}
			}
		);

		$this->assertStringStartsWith( '<div ', $controller->content_control( [], 'Visible' ) );
		$this->assertStringStartsWith( '<span ', $controller->content_control( [ 'inline' ], 'Visible' ) );
		$this->assertStringStartsWith( '<span ', $controller->content_control( [ 'inline' => 'true' ], 'Visible' ) );
		$this->assertStringStartsWith( '<div ', $controller->content_control( [ 'inline' => 'false' ], 'Visible' ) );
	}

	/**
	 * Allowed nested shortcode output is not passed through post KSES.
	 */
	public function test_allowed_nested_shortcode_html_is_preserved() {
		$controller = new ShortcodesController(
			new class() {
				public function get_option( $key, $fallback = '' ) {
					unset( $key );
					return $fallback;
				}
			}
		);
		$content    = '<form><input type="text"><iframe></iframe><svg></svg><script>window.example = true;</script></form>';

		$this->assertStringContainsString( $content, $controller->content_control( [], $content ) );
	}
}
