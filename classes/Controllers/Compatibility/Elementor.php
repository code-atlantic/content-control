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
		add_filter( 'content_control/post_types_to_ignore', [ $this, 'post_types_to_ignore' ] );
		add_filter( 'content_control/protection_is_disabled', [ $this, 'protection_is_disabled' ] );
	}

	/**
	 * Conditionally disable Content Control for Elementor builder.
	 *
	 * @param boolean $is_disabled Whether protection is disabled.
	 * @return boolean
	 */
	public function protection_is_disabled( $is_disabled ) {
		// If already disabled, no reason to continue.
		if ( $is_disabled ) {
			return $is_disabled;
		}

		return did_action( 'elementor/loaded' ) && $this->elementor_builder_is_active();
	}

	/**
	 * Add Elementor font post type to ignored post types.
	 *
	 * @param string[] $post_types Post types to ignore.
	 * @return string[]
	 */
	public function post_types_to_ignore( $post_types ) {
		$post_types[] = 'elementor_font';
		$post_types[] = 'elementor_icons';
		$post_types[] = 'elementor_library';
		$post_types[] = 'elementor_snippet';

		return $post_types;
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
