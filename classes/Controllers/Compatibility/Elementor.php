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
		add_action( 'wp', [ $this, 'disable_for_builder' ] );
	}

	/**
	 * Conditionally disable Content Control for Elementor builder.
	 *
	 * @return void
	 */
	public function disable_for_builder() {
		if ( did_action( 'elementor/loaded' ) && $this->elementor_builder_is_active() ) {
			add_filter( 'content_control/content_is_restricted', '__return_false' );
		}
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
