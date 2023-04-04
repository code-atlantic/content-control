<?php
/**
 * OAuth Connect.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Core;

use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Connection management.
 *
 * @package ContentControl
 */
class Connect {

	/**
	 * Container.
	 *
	 * @var Container
	 */
	private $c;

	/**
	 * Initialize license management.
	 *
	 * @param Container $c Container.
	 */
	public function __construct( $c ) {
		$this->c = $c;

		$this->register_hooks();
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
	}

}
