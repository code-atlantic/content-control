<?php
/**
 * Settings Page Controller Class.
 *
 * @package ContentControl
 */

namespace ContentControl\Admin;

use ContentControl\Helpers;
use ContentControl\Options;

use ContentControl\Base\Controller;
use function ContentControl\plugin;


defined( 'ABSPATH' ) || exit;

/**
 * Settings Page Controller.
 *
 * @package ContentControl\Admin
 */
class Settings extends Controller {

	/**
	 * Settings Page Title.
	 *
	 * @var string
	 */
	public $page_title = '';

	/**
	 * Settings Page Tabs.
	 *
	 * @var string[]
	 */
	public $tabs = [];

	/**
	 * Settings Option Prefix.
	 *
	 * @var string
	 */
	public $prefix = '';

	/**
	 * Initialize the settings page.
	 */
	public function init() {
		add_action( 'admin_menu', [ $this, 'register_page' ], 999 );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		$this->prefix = $this->container->get( 'option_prefix' ) . '_';
	}

	/**
	 * Register admin options pages.
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
	 * Render settings page title & container..
	 */
	public function render_page() {
		?>
			<div id="content-control-root-container"></div>
		<?php
	}

	/**
	 * Get asset meta from generated files.
	 *
	 * @return array
	 */
	public function get_asset_meta() {
		$meta_path = 'dist/settings-page.asset.php';
		return file_exists( plugin( 'path' ) . $meta_path ) ? require plugin( 'path' ) . $meta_path : [
			'dependencies' => [],
			'version'      => plugin( 'version' ),
		];
	}

	/**
	 * Enqueue assets for the settings page.
	 *
	 * @param string $hook Page hook name.
	 */
	public function enqueue_scripts( $hook ) {
		if ( 'settings_page_content-control-settings' !== $hook ) {
			return;
		}

		$handle = 'content-control-settings-page';
		$meta   = $this->get_asset_meta();

		wp_enqueue_script( $handle, plugin()->get_url( 'dist/settings-page.js' ), array_merge( $meta['dependencies'], [ 'wp-api' ] ), $meta['version'], true );
		wp_enqueue_style( $handle, plugin()->get_url( 'dist/settings-page.css' ), [ 'wp-components', 'wp-block-editor', 'dashicons' ], $meta['version'] );

		wp_localize_script( $handle, 'contentControlSettingsPage',
			[
				'pluginUrl'    => plugin( 'url' ),
				'adminUrl'     => admin_url(),
				'restBase'     => 'content-control/v2',
				'userRoles'    => \ContentControl\Rules\allowed_user_roles(),
				'rolesAndCaps' => wp_roles()->roles,
				'version'      => plugin( 'version' ),
			]
		);

		wp_localize_script( $handle, 'contentControlRuleEngine',
			[
				'adminUrl'        => admin_url(),
				'registeredRules' => plugin( 'rules' )->get_block_editor_rules(),
			]
		);

		/**
		 * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
		 * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
		 * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
		 */
		wp_set_script_translations( $handle, 'content-control' );
	}
}
