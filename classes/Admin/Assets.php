<?php


namespace JP\CC\Admin;

use JP_Content_Control;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Assets {

	public static function init() {
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'scripts_styles' ) );
	}

	public static function scripts_styles( $hook ) {
		global $post_type;

		// Use minified libraries if SCRIPT_DEBUG is turned off
		$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

		if ( $hook == 'widgets.php' ) {
			wp_enqueue_style( 'jpcc-widget-editor', JP_Content_Control::$URL . 'assets/styles/widget-editor' . $suffix . '.css', null, JP_Content_Control::$VER, false );
			wp_enqueue_script( 'jpcc-widget-editor', JP_Content_Control::$URL . 'assets/scripts/widget-editor' . $suffix . '.js', array( 'jquery' ), JP_Content_Control::$VER, true );
		}

		if ( $hook == 'settings_page_jp-cc-settings' ) {

			if ( Settings::active_tab() == 'restrictions' ) {
				add_action( 'admin_footer', array( __CLASS__, 'js_wp_editor' ) );
			}

			add_action( 'admin_footer', array( '\\JP\CC\Admin\Footer_Templates', 'fields' ) );
			add_action( 'admin_footer', array( '\\JP\CC\Admin\Footer_Templates', 'helpers' ) );
			add_action( 'admin_footer', array( '\\JP\CC\Admin\Footer_Templates', 'restrictions' ) );
			add_action( 'admin_footer', array( '\\JP\CC\Admin\Footer_Templates', 'conditions_editor' ) );


			wp_enqueue_style( 'jpcc-settings-page', JP_Content_Control::$URL . 'assets/styles/settings-page' . $suffix . '.css', array( 'editor-buttons' ), JP_Content_Control::$VER, false );
			wp_enqueue_script( 'jpcc-settings-page', JP_Content_Control::$URL . 'assets/scripts/settings-page' . $suffix . '.js', array(
				'jquery',
				'underscore',
				'wp-util',
				'wplink',
				'jquery-ui-sortable',
			), JP_Content_Control::$VER, true );

			wp_localize_script( 'jpcc-settings-page', 'jp_cc_vars', array(
				'nonce' => wp_create_nonce( 'jp-cc-admin-nonce' ),
				'I10n' => array(
					'restrictions' => array(
						'confirm_remove' => __( 'Are you sure you want to delete this restriction?', 'content-control' ),
					),
					'restriction_modal' => array(
						'title'       => __( 'Restriction Editor', 'content-control' ),
						'description' => __( 'Use this to modify a restrictions settings.', 'content-control' ),
					),
					'conditions'        => array(
						'not_operand' => array(
							'is'  => __( 'Is', 'content-control' ),
							'not' => __( 'Not', 'content-control' ),
						),
					),
					'save'              => __( 'Save', 'content-control' ),
					'cancel'            => __( 'Cancel', 'content-control' ),
					'add'               => __( 'Add', 'content-control' ),
					'update'            => __( 'Update', 'content-control' ),
				),
			) );

		}

	}


	/*
	 *	JavaScript Wordpress editor
	 *	Author: 		Ante Primorac
	 *	Author URI: 	http://anteprimorac.from.hr
	 *	Version: 		1.1
	 *	License:
	 *		Copyright (c) 2013 Ante Primorac
	 *		Permission is hereby granted, free of charge, to any person obtaining a copy
	 *		of this software and associated documentation files (the "Software"), to deal
	 *		in the Software without restriction, including without limitation the rights
	 *		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 *		copies of the Software, and to permit persons to whom the Software is
	 *		furnished to do so, subject to the following conditions:
	 *
	 *		The above copyright notice and this permission notice shall be included in
	 *		all copies or substantial portions of the Software.
	 *
	 *		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 *		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 *		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 *		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 *		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 *		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 *		THE SOFTWARE.
	 *	Usage:
	 *		server side(WP):
	 *			js_wp_editor( $settings );
	 *		client side(jQuery):
	 *			$('textarea').wp_editor( options );
	 */
	public static function js_wp_editor( $settings = array() ) {
		if ( ! class_exists( '\_WP_Editors' ) ) {
			require( ABSPATH . WPINC . '/class-wp-editor.php' );
		}

/*
		ob_start();
		wp_editor( '', 'jp_cc_id' );
		ob_get_clean();
*/
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
			wp_enqueue_media( array(
				'post' => $post,
			) );
		}

		\_WP_Editors::editor_settings( 'jp_cc_id', $set );

		$jp_cc_vars = array(
			'url'          => get_home_url(),
			'includes_url' => includes_url(),
		);

		wp_localize_script( 'jpcc-settings-page', 'jp_cc_wpeditor_vars', $jp_cc_vars );
	}
}