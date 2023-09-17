<?php
/**
 * Elementor compatibility controller.
 *
 * @package ContentControl\Admin
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl\Controllers\Compatibility;

use ContentControl\Base\Controller;

/**
 * Elementor controller class.
 */
class Elementor extends Controller {

	/**
	 * Initialize widget editor UX.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'content_control/protection_is_disabled', [ $this, 'protection_is_disabled' ] );
	}

	/**
	 * Conditionally disable Content Control for Elementor builder.
	 *
	 * @param boolean $protection_is_disabled Whether protection is disabled.
	 * @return boolean
	 */
	public function protection_is_disabled( $protection_is_disabled ) {
		if ( did_action( 'elementor/loaded' ) && $this->elementor_builder_is_active() ) {
			return true;
		}

		return $protection_is_disabled;
	}

	/**
	 * Check if Elementor builder is active.
	 *
	 * @return boolean
	 */
	public function elementor_builder_is_active() {
		return class_exists( '\Elementor\Plugin' ) &&
			isset( \Elementor\Plugin::$instance ) &&
			isset( \Elementor\Plugin::$instance->preview ) &&
			method_exists( \Elementor\Plugin::$instance->preview, 'is_preview_mode' ) &&
			\Elementor\Plugin::$instance->preview->is_preview_mode();
	}
}
