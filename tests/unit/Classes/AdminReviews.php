<?php
/**
 * Admin review controller tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Classes;

use ContentControl\Controllers\Admin\Reviews;
use ContentControl\Tests\TestCase;

/**
 * Product-aware review destinations.
 */
class AdminReviews extends TestCase {

	/**
	 * Free installations use WordPress.org without preselecting a rating.
	 */
	public function test_free_review_link_uses_unselected_wordpress_form() {
		$controller = new Reviews( $this->create_container( false ) );

		$this->assertSame(
			'https://wordpress.org/support/plugin/content-control/reviews/#rate-response',
			$controller->get_review_link()
		);
	}

	/**
	 * Pro installations use the first-party verified-customer review route.
	 */
	public function test_pro_review_link_uses_product_landing_page() {
		$controller = new Reviews( $this->create_container( true ) );

		$this->assertSame(
			'https://contentcontrolplugin.com/leave-a-review/?product=pro',
			$controller->get_review_link()
		);
	}

	/**
	 * Create the minimum Core container contract required by the controller.
	 *
	 * @param bool $pro_installed Whether Pro is installed.
	 *
	 * @return object
	 */
	private function create_container( $pro_installed ) {
		return new class( $pro_installed ) {
			/**
			 * Whether Pro is installed.
			 *
			 * @var bool
			 */
			private $pro_installed;

			/**
			 * Constructor.
			 *
			 * @param bool $pro_installed Whether Pro is installed.
			 */
			public function __construct( $pro_installed ) {
				$this->pro_installed = $pro_installed;
			}

			/**
			 * Match the Core container API.
			 *
			 * @return bool
			 */
			public function is_pro_installed() {
				return $this->pro_installed;
			}
		};
	}
}
