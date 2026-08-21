<?php
/**
 * Stream controller tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Classes;

use ContentControl\Base\Stream as StreamController;
use ContentControl\Tests\TestCase;

/**
 * Server-sent event stream behavior.
 */
class Stream extends TestCase {

	/**
	 * Payload lines cannot inject additional SSE fields.
	 */
	public function test_payload_lines_are_framed_as_data_fields() {
		$controller = new class() extends StreamController {
			/**
			 * Skip the WordPress-dependent stream-name setup for this formatter test.
			 */
			public function __construct() {}

			/**
			 * Expose the protected formatter for testing.
			 *
			 * @param string $data Data to format.
			 *
			 * @return string
			 */
			public function format( $data ) {
				return $this->format_data( $data );
			}
		};

		$payload = '</script><img src=x onerror=alert(1)>' . "\r\nevent: injected\n\ndata: forged";

		$this->assertSame(
			'data: </script><img src=x onerror=alert(1)>' . PHP_EOL .
			'data: event: injected' . PHP_EOL .
			'data: ' . PHP_EOL .
			'data: data: forged' . PHP_EOL,
			$controller->format( $payload )
		);
	}
}
