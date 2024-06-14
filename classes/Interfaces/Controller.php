<?php
/**
 * Plugin container.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Interfaces;

defined( 'ABSPATH' ) || exit;

/**
 * Localized controller class.
 */
interface Controller {

	/**
	 * Handle hooks & filters or various other init tasks.
	 *
	 * @return void
	 */
	public function init();

	/**
	 * Check if controller is enabled.
	 *
	 * @return bool
	 */
	public function controller_enabled();
}
