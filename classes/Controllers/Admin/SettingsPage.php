<?php
/**
 * Settings Page Controller Class.
 *
 * @package ContentControl
 */

namespace ContentControl\Controllers\Admin;

use ContentControl\Base\Controller;

defined( 'ABSPATH' ) || exit;

/**
 * Settings Page Controller.
 *
 * @package ContentControl\Admin
 */
class SettingsPage extends Controller {

	/**
	 * Initialize the settings page.
	 */
	public function init() {
		add_action( 'admin_menu', [ $this, 'register_page' ], 999 );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Register admin options pages.
	 *
	 * @return void
	 */
	public function register_page() {
		add_options_page(
			__( 'Content Control', 'content-control' ),
			__( 'Content Control', 'content-control' ),
			'manage_options',
			'content-control-settings',
			[ $this, 'render_page' ]
		);
	}

	/**
	 * Render settings page title & container.
	 *
	 * @return void
	 */
	public function render_page() {
		?>
			<div id="content-control-root-container"></div>
			<script>jQuery(() => window.contentControl.settingsPage.init());</script>
		<?php
	}

	/**
	 * Enqueue assets for the settings page.
	 *
	 * @param string $hook Page hook name.
	 *
	 * @return void
	 */
	public function enqueue_scripts( $hook ) {
		if ( 'settings_page_content-control-settings' !== $hook ) {
			return;
		}

		wp_enqueue_editor();
		wp_tinymce_inline_scripts();

		wp_enqueue_script( 'content-control-settings-page' );
	}
}
