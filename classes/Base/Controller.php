<?php
/**
 * Plugin controller.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Base;

defined( 'ABSPATH' ) || exit;

/**
 * Localized container class.
 */
abstract class Controller implements \ContentControl\Interfaces\Controller {

	/**
	 * Plugin Container.
	 *
	 * @var \ContentControl\Plugin\Core
	 */
	public $container;

	/**
	 * Initialize based on dependency injection principles.
	 *
	 * @param \ContentControl\Plugin\Core $container Plugin container.
	 * @return void
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

	/**
	 * Check if controller is enabled.
	 *
	 * @return bool
	 */
	public function controller_enabled() {
		return true;
	}
}
