<?php
/**
 * Mixed-version Pro compatibility tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Classes;

use ContentControl\Controllers\RestAPI;
use ContentControl\Tests\Fixtures\ProCompatibilityCoreFixture;
use ContentControl\Tests\PluginTestCase;

require_once __DIR__ . '/../Fixtures/ProCompatibilityCoreFixture.php';
require_once __DIR__ . '/../Fixtures/ProConfig.php';

/**
 * Mixed-version Pro behavior.
 */
class ProCompatibility extends PluginTestCase {

	/**
	 * Clean fixture globals.
	 */
	protected function tearDown(): void {
		unset( $GLOBALS['content_control_test_pro_version'] );
		parent::tearDown();
	}

	/**
	 * The license bridge is exclusive to active Pro versions below 1.3.0.
	 */
	public function test_legacy_pro_version_gate() {
		$core = new ProCompatibilityCoreFixture();

		$GLOBALS['content_control_test_pro_version'] = '1.2.1';
		$this->assertTrue( $core->is_legacy_pro_active() );

		$GLOBALS['content_control_test_pro_version'] = '1.3.0';
		$this->assertFalse( $core->is_legacy_pro_active() );

		$GLOBALS['content_control_test_pro_version'] = '1.4.0';
		$this->assertFalse( $core->is_legacy_pro_active() );

		$core->pro_active                            = false;
		$GLOBALS['content_control_test_pro_version'] = '1.2.1';
		$this->assertFalse( $core->is_legacy_pro_active() );
	}

	/**
	 * The incompatible Pro endpoint is removed without disturbing other routes.
	 */
	public function test_legacy_installer_route_is_removed() {
		$controller = new RestAPI( new ProCompatibilityCoreFixture() );
		$endpoints  = [
			'/content-control/v2/addons/install' => [ [ 'methods' => 'POST' ] ],
			'/content-control/v2/addons'         => [ [ 'methods' => 'GET' ] ],
		];

		$filtered = $controller->disable_legacy_pro_installer_route( $endpoints );

		$this->assertArrayNotHasKey( '/content-control/v2/addons/install', $filtered );
		$this->assertArrayHasKey( '/content-control/v2/addons', $filtered );
	}
}
