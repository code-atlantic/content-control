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
	 * Check if controller is enabled.
	 *
	 * @return bool
	 */
	public function controller_enabled() {
		return class_exists( '\Elementor\Plugin' ) || did_action( 'elementor/loaded' );
	}

	/**
	 * Conditionally disable Content Control for Elementor builder.
	 *
	 * @param boolean $is_disabled Whether protection is disabled.
	 * @return boolean
	 */
	public function protection_is_disabled( $is_disabled ) {
		// If already disabled, no reason to continue.
		if ( $is_disabled || ! did_action( 'elementor/loaded' ) ) {
			return $is_disabled;
		}

		return $this->elementor_builder_is_active();
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
		// Check if this is the admin theme builder app.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended Simple & direct string comparison.
		if (
			is_admin() &&
			// Disable notices as this is a generic string comparison to prevent doing a lot of work.
			// phpcs:disable WordPress.Security.NonceVerification.Recommended
			! empty( $_GET['page'] ) &&
			'elementor-app' === $_GET['page']
			// phpcs:enable WordPress.Security.NonceVerification.Recommended
		) {
			return true;
		}

		if ( ! class_exists( '\Elementor\Plugin' ) || ! isset( \Elementor\Plugin::$instance ) ) {
			return false;
		}

		/**
		 * Elementor instance.
		 *
		 * @var \Elementor\Plugin $elementor
		 */
		$elementor = \Elementor\Plugin::$instance;

		/**
		 * Elementor preview instance.
		 *
		 * @var \Elementor\Preview|(object{is_preview_mod:\Closure}&\stdClass)|false $preview
		 */
		$preview = isset( $elementor->preview ) ? $elementor->preview : false;

		if ( false === $preview || ! method_exists( $preview, 'is_preview_mode' ) ) {
			return false;
		}

		// Check if the page builder is active.
		return $preview->is_preview_mode();
	}
}
