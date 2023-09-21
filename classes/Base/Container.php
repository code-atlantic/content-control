<?php
/**
 * Plugin container.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Base;

defined( 'ABSPATH' ) || exit;

use ContentControl\Vendor\Pimple\Container as Base;

/**
 * Localized container class.
 */
class Container extends Base {
	/**
	 * Get item from container
	 *
	 * @param string $id Key for the item.
	 *
	 * @return mixed Current value of the item.
	 */
	public function get( $id ) {
		return $this->offsetGet( $id );
	}

	/**
	 * Set item in container
	 *
	 * @param string $id Key for the item.
	 * @param mixed  $value Value to be set.
	 *
	 * @return void
	 */
	public function set( $id, $value ) {
		$this->offsetSet( $id, $value );
	}
}
