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
	 * @var \ContentControl\Core\Plugin
	 */
	public $container;

	/**
	 * Initialize based on dependency injection principles.
	 *
	 * @param \ContentControl\Core\Plugin $container Plugin container.
	 * @return void
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

}
