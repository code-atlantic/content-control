<?php


namespace JP\CC\Admin;

use JP\CC\Helpers;
use JP\CC\Options;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Settings {

	private static $title;
	private static $_tabs;
	private static $_prefix;

	public static function init( $title, $tabs = array() ) {
		static::$title   = $title;
		static::$_tabs   = $tabs;
		static::$_prefix = trim( Options::$_prefix, '_' ) . '_';
		Settings\Restrictions::init();
		add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
		add_filter( static::$_prefix . 'settings_sanitize_text', array( __CLASS__, 'sanitize_text_field' ) );
		add_filter( static::$_prefix . 'settings_sanitize_field_restrictions', array( __CLASS__, 'sanitize_restrictions' ), 10, 2 );
	}

	/**
	 * Render settings page with tabs.
	 */
	public static function page() {
		?>

		<div class="wrap">
			<h1><?php echo esc_html( static::$title ); ?></h1>

			<h2 id="<?php echo static::$_prefix; ?>tabs" class="nav-tab-wrapper"><?php
				foreach ( static::tabs() as $id => $tab ) {

					$active = $tab['active'] ? ' nav-tab-active' : '';

					echo '<a href="' . esc_url( $tab['url'] ) . '" title="' . esc_attr( $tab['label'] ) . '" class="nav-tab' . $active . '">';
					echo esc_html( $tab['label'] );
					echo '</a>';
				} ?>
			</h2>

			<form id="<?php echo static::$_prefix; ?>settings" method="post" action="options.php">
				<?php do_action( static::$_prefix . 'form_nonce' ); ?>
				<?php settings_fields( static::$_prefix . 'settings' ); ?>
				<div id="poststuff">
					<div id="post-body" class="metabox-holder columns-1">
						<div id="post-body-content">
							<div id="tab_container"><?php
								if ( static::active_tab() == 'restrictions' ) :
									do_action( 'jp_cc_restriction_editor' );
								else : ?>
									<table class="form-table"><?php
										Setting_Callbacks::init( static::$_prefix, Options::get_all() );
										do_settings_fields( static::$_prefix . 'settings_' . static::active_tab(), static::$_prefix . 'settings_' . static::active_tab() ); ?>
									</table>
								<?php endif;

								submit_button(); ?>
							</div>
							<!-- #tab_container-->
						</div>
					</div>
					<br class="clear" />
				</div>
			</form>
		</div>

		<?php
	}

	/**
	 * Returns all settings tabs, with labels, urls & status.
	 *
	 * @return array
	 */
	public static function tabs() {

		static $tabs;

		if ( ! isset( $tabs ) ) {
			$tabs = array();

			$registered_settings = static::registered_settings();

			reset( static::$_tabs );

			$active_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : key( static::$_tabs );

			foreach ( static::$_tabs as $id => $label ) {
				if ( ! empty( $registered_settings[ $id ] ) ) {
					$tabs[ $id ] = array(
						'label'  => $label,
						'active' => $id == $active_tab,
						'url'    => add_query_arg( array(
							'settings-updated' => false,
							'tab'              => $id,
						) ),
					);
				}
			}
		}

		return $tabs;
	}

	/**
	 * Check for the active / current tab.
	 *
	 * @return bool|string
	 */
	public static function active_tab() {
		static $active;

		if ( ! isset( $active ) ) {
			$active = false;
			foreach ( static::tabs() as $id => $tab ) {
				if ( $tab['active'] ) {
					$active = $id;
				}
			}
		}

		return $active;
	}

	/**
	 * Retrieve the array of plugin settings
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public static function registered_settings() {

		static $settings;

		if ( ! isset( $settings ) ) {

			/**
			 * 'Whitelisted' settings, filters are provided for each settings.
			 */
			$settings = array(
				/** General Settings */
				'restrictions' => apply_filters( static::$_prefix . 'settings_restrictions', array(
					'restrictions' => array(
						'id'   => 'restrictions',
						'type' => 'hook',
					),
				) ),
				'general'      => apply_filters( static::$_prefix . 'settings_general', array(
					'default_denial_message' => array(
						'id'    => 'default_denial_message',
						'label' => 'Default Denial Message',
						'type'  => 'rich_editor',
					),
				) ),
				/** Addon Settings */
				//'addons'   => apply_filters( static::$_prefix . 'settings_addons', array() ),
				//'licenses' => apply_filters( static::$_prefix . 'settings_licenses', array() ),
				/** Misc Settings */
				'misc'         => apply_filters( static::$_prefix . 'settings_misc', array() ),
			);

			$settings = apply_filters( static::$_prefix . 'registered_settings', $settings );
		}

		return $settings;
	}

	public static function register_settings() {

		if ( false == get_option( static::$_prefix . 'settings' ) ) {
			add_option( static::$_prefix . 'settings' );
		}

		foreach ( static::registered_settings() as $tab => $settings ) {

			$page = static::$_prefix . 'settings_' . $tab;

			add_settings_section( $page, __return_null(), '__return_false', $page );

			foreach ( $settings as $id => $option ) {

				$name = isset( $option['label'] ) ? $option['label'] : '';

				if ( method_exists( '\\JP\CC\Admin\Setting_Callbacks', $option['type'] ) ) {
					$callback = array( '\\JP\CC\Admin\Setting_Callbacks', $option['type'] );
				} elseif ( function_exists( static::$_prefix . $option['type'] . '_callback' ) ) {
					$callback = static::$_prefix . $option['type'] . '_callback';
				} else {
					$callback = array( '\\JP\CC\Setting_Callbacks', 'missing_callback' );
				}

				add_settings_field( static::$_prefix . 'settings_' . $option['id'], $name, $callback, $page, $page, array(
						'section'     => $tab,
						'id'          => isset( $option['id'] ) ? $option['id'] : $id,
						'desc'        => ! empty( $option['desc'] ) ? $option['desc'] : '',
						// TODO replace the hardcoded names in Setting_Callbacks with this value.
						'name'        => isset( $option['name'] ) ? $option['name'] : null,
						'size'        => isset( $option['size'] ) ? $option['size'] : null,
						'options'     => isset( $option['options'] ) ? $option['options'] : '',
						'std'         => isset( $option['std'] ) ? $option['std'] : '',
						'min'         => isset( $option['min'] ) ? $option['min'] : null,
						'max'         => isset( $option['max'] ) ? $option['max'] : null,
						'step'        => isset( $option['step'] ) ? $option['step'] : null,
						'chosen'      => isset( $option['chosen'] ) ? $option['chosen'] : null,
						'placeholder' => isset( $option['placeholder'] ) ? $option['placeholder'] : null,
						'allow_blank' => isset( $option['allow_blank'] ) ? $option['allow_blank'] : true,
						'readonly'    => isset( $option['readonly'] ) ? $option['readonly'] : false,
					) );
			}

		}

		// Creates our settings in the options table
		register_setting( static::$_prefix . 'settings', static::$_prefix . 'settings', array( __CLASS__, 'settings_sanitize' ) );

	}

	public static function settings_sanitize( $input ) {


		if ( empty( $_POST['_wp_http_referer'] ) ) {
			return $input;
		}

		$current_values = Options::get_all();

		parse_str( $_POST['_wp_http_referer'], $referrer );

		$prefix = static::$_prefix;

		$tab = isset( $referrer['tab'] ) ? $referrer['tab'] : static::active_tab();

		$settings = static::registered_settings();

		$input = $input ? $input : array();

		// Apply a filter per tab like jp_cc_settings_general_sanitize
		$input = apply_filters( "{$prefix}settings_{$tab}_sanitize", $input );

		// Loop through each setting being saved and pass it through a sanitization filter
		foreach ( $input as $key => $value ) {

			// Field id specific filter
			$value = apply_filters( "{$prefix}settings_sanitize_field_{$key}", $value );

			// Get the setting type (checkbox, select, etc)
			$type = isset( $settings[ $tab ][ $key ]['type'] ) ? $settings[ $tab ][ $key ]['type'] : false;

			if ( $type ) {
				// Field type specific filter
				$value = apply_filters( "{$prefix}settings_sanitize_{$type}", $value, $key );
			}

			// General filter
			$input[ $key ] = apply_filters( "{$prefix}settings_sanitize", $value, $key );

		}

		// Loop through the whitelist and unset any that are empty for the tab being saved
		if ( ! empty( $settings[ $tab ] ) ) {
			foreach ( $settings[ $tab ] as $key => $value ) {
				// settings used to have numeric keys, now they have keys that match the option ID. This ensures both methods work
				if ( is_numeric( $key ) ) {
					$key = $value['id'];
				}
				if ( empty( $input[ $key ] ) ) {
					unset( $current_values[ $key ] );
				}
			}
		}

		// Merge our new settings with the existing
		$output = array_merge( $current_values, $input );

		add_settings_error( 'jp-cc-notices', '', __( 'Settings updated.', 'content-control' ), 'updated' );

		return $output;
	}

	public static function sanitize_restrictions( $restrictions = array() ) {
		if ( ! empty( $restrictions ) ) {

			foreach ( $restrictions as $key => $restriction ) {

				if ( is_string( $restriction ) ) {
					try {
						$restriction = json_decode( $restriction );
					} catch ( \Exception $e ) {};
				}

				$restrictions[ $key ] = Helpers::object_to_array( $restriction );

			}
		}

		return $restrictions;
	}


	/**
	 * Sanitize text fields
	 *
	 * @param array $input The field value
	 *
	 * @return string $input Sanitizied value
	 */
	public static function sanitize_text_field( $input ) {
		return trim( $input );
	}

}
