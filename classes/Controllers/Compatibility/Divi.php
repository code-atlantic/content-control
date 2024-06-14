<?php
/**
 * Divi compatibility controller.
 *
 * @package ContentControl\Admin
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl\Controllers\Compatibility;

use ContentControl\Base\Controller;

/**
 * Divi controller class.
 */
class Divi extends Controller {

	/**
	 * Initialize widget editor UX.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'content_control/protection_is_disabled', [ $this, 'protection_is_disabled' ] );
	}

	/**
	 * Check if controller is enabled.
	 *
	 * @return bool
	 */
	public function controller_enabled() {
		return defined( 'ET_CORE_VERSION' );
	}

	/**
	 * Conditionally disable Content Control for Divi builder.
	 *
	 * @param boolean $protection_is_disabled Whether protection is disabled.
	 * @return boolean
	 */
	public function protection_is_disabled( $protection_is_disabled ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['et_fb'] ) && ! empty( $_GET['et_fb'] ) ) {
			return true;
		}

		return $protection_is_disabled;
	}
}
