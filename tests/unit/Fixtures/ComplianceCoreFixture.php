<?php
/**
 * Core fixture for compliance migration tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Fixtures;

use ContentControl\Plugin\Core;

/**
 * Isolate the active-Pro decision from the filesystem and plugin bootstrap.
 */
class ComplianceCoreFixture extends Core {

	/**
	 * Whether the Pro fixture is active.
	 *
	 * @var bool
	 */
	public $pro_active = true;

	/**
	 * Skip the full plugin bootstrap.
	 */
	public function __construct() {
	}

	/**
	 * Return the fixture state.
	 *
	 * @return bool
	 */
	public function is_pro_active() {
		return $this->pro_active;
	}
}
