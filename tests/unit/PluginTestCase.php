<?php
/**
 * PHPUnit TestCase class.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests;

use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Brain\Monkey;

/**
 * TestCase base class.
 */
abstract class PluginTestCase extends TestCase {

	// Adds Mockery expectations to the PHPUnit assertions count.
	use MockeryPHPUnitIntegration;

	/**
	 * Runs before each test.
	 */
	protected function setUp(): void {
		parent::setUp();
		Monkey\setUp();
		require_once __DIR__ . '/../../inc/functions.php';
	}

	/**
	 * Runs after each test.
	 */
	protected function tearDown(): void {
		Monkey\tearDown();
		parent::tearDown();
	}
}
