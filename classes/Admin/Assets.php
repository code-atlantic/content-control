<?php
/**
 * Admin assets controller.
 *
 * @package ContentControl\Admin
 */

namespace ContentControl\Admin;

use ContentControl\Base\Controller;
use ContentControl\Vendor\Pimple\Exception\UnknownIdentifierException;

use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Admin assets controller.
 *
 * @package ContentControl\Admin
 */
class Assets extends Controller {

	/**
	 * Initialize the assets controller.
	 */
	public function init() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'v1_scripts' ] );
		add_action( 'admin_print_scripts', [ $this, 'autoload_styles_for_scripts' ], 0 );
	}

	/**
	 * Get list of plugin packages.
	 *
	 * @return array
	 */
	public function get_packages() {
		$permissions = plugin()->get_permissions();

		foreach ( $permissions as $permission => $cap ) {
			$permissions[ $permission ] = current_user_can( $cap );
		}

		$packages = [
			'block-editor'  => [
				'handle'   => 'content-control-block-editor',
				'styles'   => true,
				'varsName' => 'contentControlBlockEditor',
				'vars'     => [
					'adminUrl'       => admin_url(),
					'pluginUrl'      => plugin()->get_url(),
					'advancedMode'   => \ContentControl\get_option( 'advancedMode' ),
					'allowedBlocks'  => [],
					'excludedBlocks' => [
						'core/nextpage',
						'core/freeform',
					],
					'permissions'    => $permissions,
				],
			],
			'components'    => [
				'handle' => 'content-control-components',
				'styles' => true,
			],
			'core-data'     => [
				'handle' => 'content-control-core-data',
				'deps'   => [
					'wp-api',
				],
			],
			'data'          => [
				'handle' => 'content-control-data',
			],
			'fields'        => [
				'handle' => 'content-control-fields',
			],
			'icons'         => [
				'handle' => 'content-control-icons',
			],
			'rule-engine'   => [
				'handle'   => 'content-control-rule-engine',
				'varsName' => 'contentControlRuleEngine',
				'vars'     => [
					'adminUrl'        => admin_url(),
					'registeredRules' => plugin( 'rules' )->get_block_editor_rules(),
				],
				'styles'   => true,
			],
			'settings-page' => [
				'handle' => 'content-control-settings-page',
				'styles' => true,
			],
			'utils'         => [
				'handle' => 'content-control-utils',
			],
		];

		return $packages;
	}

	/**
	 * Enqueue shared admin scripts.
	 */
	public function enqueue_scripts() {
		$packages = $this->get_packages();

		foreach ( $packages as $package => $package_data ) {
			$handle = $package_data['handle'];
			$meta   = $this->get_asset_meta( $package );

			$js_deps = isset( $package_data['deps'] ) ? $package_data['deps'] : [];

			wp_register_script( $handle, plugin()->get_url( "dist/$package.js" ), array_merge( $meta['dependencies'], $js_deps ), $meta['version'], true );

			if ( isset( $package_data['styles'] ) && $package_data['styles'] ) {
				wp_register_style( $handle, plugin()->get_url( "dist/$package.css" ), [ 'wp-components', 'wp-block-editor', 'dashicons' ], $meta['version'] );
			}

			if ( isset( $package_data['varsName'] ) && ! empty( $package_data['vars'] ) ) {
				wp_localize_script( $handle, $package_data['varsName'], $package_data['vars'] );
			}
		}
	}

	/**
	 * Auto load styles if scripts are enqueued.
	 */
	function autoload_styles_for_scripts() {
		$packages = $this->get_packages();

		foreach ( $packages as $package => $package_data ) {
			if ( wp_script_is( $package_data['handle'], 'enqueued' ) ) {
				if ( isset( $package_data['styles'] ) && $package_data['styles'] ) {
					wp_enqueue_style( $package_data['handle'] );
				}
			}
		}
	}

	/**
	 * Get asset meta from generated files.
	 *
	 * @param string $package Package name.
	 * @return array
	 */
	public function get_asset_meta( $package ) {
		$meta_path = "dist/$package.asset.php";
		return file_exists( plugin( 'path' ) . $meta_path ) ? require plugin( 'path' ) . $meta_path : [
			'dependencies' => [],
			'version'      => plugin( 'version' ),
		];
	}

	/**
	 * Enqueue v1 admin scripts.
	 *
	 * @param mixed $hook Admin page hook name.
	 */
	public function v1_scripts( $hook ) {
		// Use minified libraries if SCRIPT_DEBUG is turned off.
		$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

		if ( 'widgets.php' === $hook ) {
			wp_enqueue_style( 'jpcc-widget-editor', plugin()->get_url( 'assets/styles/widget-editor' . $suffix . '.css' ), null, plugin( 'version' ), false );
			wp_enqueue_script( 'jpcc-widget-editor', plugin()->get_url( 'assets/scripts/widget-editor' . $suffix . '.js' ), [ 'jquery' ], plugin( 'version' ), true );
		}

		if ( 'settings_page_cc-settings' === $hook ) {
			if ( isset( $_GET['tab'] ) && 'restrictions' === $_GET['tab'] ) {
				add_action( 'admin_footer', [ $this, 'js_wp_editor' ] );
			}

			Footer_Templates::init();

			wp_enqueue_style( 'jpcc-settings-page', plugin()->get_url( 'assets/styles/settings-page' . $suffix . '.css' ), [ 'editor-buttons' ], plugin( 'version' ), false );
			wp_enqueue_script( 'jpcc-settings-page', plugin()->get_url( 'assets/scripts/settings-page' . $suffix . '.js' ), [
				'jquery',
				'underscore',
				'wp-util',
				'wplink',
				'jquery-ui-sortable',
			], plugin( 'version' ), true );

			wp_localize_script( 'jpcc-settings-page', 'jp_cc_vars', [
				'nonce' => wp_create_nonce( 'jp-cc-admin-nonce' ),
				'I10n'  => [
					'tabs'              => [
						'general'    => __( 'General', 'content-control' ),
						'protection' => __( 'Protection', 'content-control' ),
						'content'    => __( 'Content', 'content-control' ),
					],
					'restrictions'      => [
						'confirm_remove' => __( 'Are you sure you want to delete this restriction?', 'content-control' ),
					],
					'restriction_modal' => [
						'title'       => __( 'Restriction Editor', 'content-control' ),
						'description' => __( 'Use this to modify a restrictions settings.', 'content-control' ),
					],
					'conditions'        => [
						'not_operand' => [
							'is'  => __( 'Is', 'content-control' ),
							'not' => __( 'Not', 'content-control' ),
						],
					],
					'save'              => __( 'Save', 'content-control' ),
					'cancel'            => __( 'Cancel', 'content-control' ),
					'add'               => __( 'Add', 'content-control' ),
					'update'            => __( 'Update', 'content-control' ),
				],
			] );
		}
	}

	/**
	 *  JavaScript WordPress editor
	 *  Author:         Ante Primorac
	 *  Author URI:     http://anteprimorac.from.hr
	 *  Version:        1.1
	 *  License:
	 *      Copyright (c) 2013 Ante Primorac
	 *      Permission is hereby granted, free of charge, to any person obtaining a copy
	 *      of this software and associated documentation files (the "Software"), to deal
	 *      in the Software without restriction, including without limitation the rights
	 *      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *      copies of the Software, and to permit persons to whom the Software is
	 *      furnished to do so, subject to the following conditions:
	 *
	 *      The above copyright notice and this permission notice shall be included in
	 *      all copies or substantial portions of the Software.
	 *
	 *      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *      THE SOFTWARE.
	 *  Usage:
	 *      server side(WP):
	 *          js_wp_editor( $settings );
	 *      client side(jQuery):
	 *          $('textarea').wp_editor( options );
	 *
	 * @param array $settings Array of settings.
	 */
	public function js_wp_editor( $settings = [] ) {
		if ( ! class_exists( '\_WP_Editors' ) ) {
			require ABSPATH . WPINC . '/class-wp-editor.php';
		}

		$set = \_WP_Editors::parse_settings( 'jp_cc_id', $settings );

		if ( ! current_user_can( 'upload_files' ) ) {
			$set['media_buttons'] = false;
		}

		if ( $set['media_buttons'] ) {
			wp_enqueue_style( 'buttons' );
			wp_enqueue_script( 'thickbox' );
			wp_enqueue_style( 'thickbox' );
			wp_enqueue_script( 'media-upload' );
			wp_enqueue_script( 'wp-embed' );

			$post = get_post( 1 );
			if ( ! $post && ! empty( $GLOBALS['post_ID'] ) ) {
				$post = $GLOBALS['post_ID'];
			}
			wp_enqueue_media( [
				'post' => $post,
			] );
		}

		\_WP_Editors::editor_settings( 'jp_cc_id', $set );

		$jp_cc_vars = [
			'url'          => get_home_url(),
			'includes_url' => includes_url(),
		];

		wp_localize_script( 'jpcc-settings-page', 'jp_cc_wpeditor_vars', $jp_cc_vars );
	}
}
