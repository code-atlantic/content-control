<?php

namespace JP\CC\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Setting_Callbacks {

	private static $_prefix;
	private static $_options;

	public static function init( $prefix, $options = array() ) {
		static::$_prefix  = $prefix;
		static::$_options = $options;
	}

	/**
	 * Header Callback
	 *
	 * Renders the header.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function header( $args ) {
		echo '<hr/>';
	}

	/**
	 * Checkbox Callback
	 *
	 * Renders checkboxes.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function checkbox( $args ) {
		$checked = isset( static::$_options[ $args['id'] ] ) ? checked( 1, static::$_options[ $args['id'] ], false ) : '';
		$html    = '<input type="checkbox" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']" value="1" ' . $checked . '/>';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Multicheck Callback
	 *
	 * Renders multiple checkboxes.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function multicheck( $args ) {
		if ( ! empty( $args['options'] ) ) {
			foreach ( $args['options'] as $key => $option ):
				if ( isset( static::$_options[ $args['id'] ][ $key ] ) ) {
					$enabled = $option;
				} else {
					$enabled = null;
				}
				echo '<input name="' . static::$_prefix . 'settings[' . $args['id'] . '][' . $key . ']" id="' . static::$_prefix . 'settings_' . $args['id'] . '[' . $key . ']" type="checkbox" value="' . $option . '" ' . checked( $option, $enabled, false ) . '/>&nbsp;';
				echo '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '[' . $key . ']">' . $option . '</label><br/>';
			endforeach;
			echo '<p class="description">' . $args['desc'] . '</p>';
		}
	}

	/**
	 * Radio Callback
	 *
	 * Renders radio boxes.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function radio( $args ) {

		foreach ( $args['options'] as $key => $option ) :
			$checked = false;

			if ( isset( static::$_options[ $args['id'] ] ) && static::$_options[ $args['id'] ] == $key ) {
				$checked = true;
			} elseif ( isset( $args['std'] ) && $args['std'] == $key && ! isset( static::$_options[ $args['id'] ] ) ) {
				$checked = true;
			}

			echo '<input name="' . static::$_prefix . 'settings[' . $args['id'] . ']"" id="' . static::$_prefix . 'settings_' . $args['id'] . '[' . $key . ']" type="radio" value="' . $key . '" ' . checked( true, $checked, false ) . '/>&nbsp;';
			echo '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '[' . $key . ']">' . $option . '</label><br/>';
		endforeach;

		echo '<p class="description">' . $args['desc'] . '</p>';
	}

	/**
	 * Text Callback
	 *
	 * Renders text fields.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function text( $args ) {

		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		$readonly = $args['readonly'] === true ? ' readonly="readonly"' : '';
		$size     = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : 'regular';
		$html     = '<input type="text" class="' . $size . '-text" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']" value="' . esc_attr( stripslashes( $value ) ) . '"' . $readonly . '/>';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Number Callback
	 *
	 * Renders number fields.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function number( $args ) {


		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		$max  = isset( $args['max'] ) ? $args['max'] : 999999;
		$min  = isset( $args['min'] ) ? $args['min'] : 0;
		$step = isset( $args['step'] ) ? $args['step'] : 1;

		$size = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : 'regular';
		$html = '<input type="number" step="' . esc_attr( $step ) . '" max="' . esc_attr( $max ) . '" min="' . esc_attr( $min ) . '" class="' . $size . '-text" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']" value="' . esc_attr( stripslashes( $value ) ) . '"/>';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Textarea Callback
	 *
	 * Renders textarea fields.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function textarea( $args ) {


		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		$html = '<textarea class="large-text" cols="50" rows="5" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']">' . esc_textarea( stripslashes( $value ) ) . '</textarea>';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Password Callback
	 *
	 * Renders password fields.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function password( $args ) {


		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		$size = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : 'regular';
		$html = '<input type="password" class="' . $size . '-text" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']" value="' . esc_attr( $value ) . '"/>';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Missing Callback
	 *
	 * If a function is missing for settings callbacks alert the user.
	 *
	 * @param array $args Arguments passed by the setting
	 *
	 * @return void
	 */
	public static function missing( $args ) {
		printf( __( 'The callback function used for the <strong>%s</strong> setting is missing.', 'content-control' ), $args['id'] );
	}

	/**
	 * Select Callback
	 *
	 * Renders select fields.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function select( $args ) {


		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		if ( isset( $args['placeholder'] ) ) {
			$placeholder = $args['placeholder'];
		} else {
			$placeholder = '';
		}

		if ( isset( $args['chosen'] ) ) {
			$chosen = 'class="'. static::$_prefix . '-chosen"';
		} else {
			$chosen = '';
		}

		$html = '<select id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']" ' . $chosen . 'data-placeholder="' . $placeholder . '" />';

		foreach ( $args['options'] as $option => $name ) :
			$selected = selected( $option, $value, false );
			$html .= '<option value="' . $option . '" ' . $selected . '>' . $name . '</option>';
		endforeach;

		$html .= '</select>';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Dashicon Callback
	 *
	 * Renders select fields with dashicon preview.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function dashicon( $args ) {


		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		$readonly = $args['readonly'] === true ? ' readonly="readonly"' : '';
		$size     = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : 'regular';

		$html = '<div class="dashicon-picker">';

		$html .= '<input class="regular-text" type="hidden" class="' . $size . '-text" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']" value="' . esc_attr( stripslashes( $value ) ) . '"' . $readonly . '/>';
		$html .= '<span id="' . static::$_prefix . 'settings_' . $args['id'] . '_preview" class="dashicons-picker-preview dashicons ' . $value . '"></span>';

		$html .= '<input type="button" data-target="#'. static::$_prefix . 'settings_' . $args['id'] . '" data-preview="#'. static::$_prefix . '_settings_' . $args['id'] . '_preview" class="button dashicons-picker" value="' . __( 'Choose Icon', 'content-control' ) . '" />';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		$html .= '</div>';

		echo $html;
	}

	/**
	 * Color select Callback
	 *
	 * Renders color select fields.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function color_select( $args ) {


		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}
		$html = '<select id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']"/>';

		foreach ( $args['options'] as $option => $color ) :
			$selected = selected( $option, $value, false );
			$html .= '<option value="' . $option . '" ' . $selected . '>' . $color['label'] . '</option>';
		endforeach;

		$html .= '</select>';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Rich Editor Callback
	 *
	 * Renders rich editor fields.
	 *
	 * @param array $args Arguments passed by the setting
	 *
	 * @global $wp_version WordPress Version
	 */
	public static function rich_editor( $args ) {
		global $wp_version;

		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];

			if ( empty( $args['allow_blank'] ) && empty( $value ) ) {
				$value = isset( $args['std'] ) ? $args['std'] : '';
			}
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		$rows = isset( $args['size'] ) ? $args['size'] : 20;

		if ( $wp_version >= 3.3 && function_exists( 'wp_editor' ) ) {
			ob_start();
			wp_editor( stripslashes( $value ), static::$_prefix . 'settings_' . $args['id'], array(
				'textarea_name' => static::$_prefix . 'settings[' . $args['id'] . ']',
				'textarea_rows' => $rows,
			) );
			$html = ob_get_clean();
		} else {
			$html = '<textarea class="large-text" rows="10" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']">' . esc_textarea( stripslashes( $value ) ) . '</textarea>';
		}

		$html .= '<br/><label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Upload Callback
	 *
	 * Renders upload fields.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function upload( $args ) {


		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		$size = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : 'regular';
		$html = '<input type="text" class="' . $size . '-text" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']" value="' . esc_attr( stripslashes( $value ) ) . '"/>';
		$html .= '<span>&nbsp;<input type="button" class="' . static::$_prefix . 'settings_upload_button button-secondary" value="' . __( 'Upload File', 'content-control' ) . '"/></span>';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Color picker Callback
	 *
	 * Renders color picker fields.
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function color( $args ) {


		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		$default = isset( $args['std'] ) ? $args['std'] : '';

		$size = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : 'regular';
		$html = '<input type="text" class="'. static::$_prefix . 'color-picker" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']" value="' . esc_attr( $value ) . '" data-default-color="' . esc_attr( $default ) . '" />';
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Descriptive text callback.
	 *
	 * Renders descriptive text onto the settings field.
	 *
	 * @param array $args Arguments passed by the setting
	 *
	 * @return void
	 */
	public static function descriptive_text( $args ) {
		echo wp_kses_post( $args['desc'] );
	}

	/**
	 * Registers the license field callback for Software Licensing
	 *
	 * @param array $args Arguments passed by the setting
	 */
	public static function license_key( $args ) {


		if ( isset( static::$_options[ $args['id'] ] ) ) {
			$value = static::$_options[ $args['id'] ];
		} else {
			$value = isset( $args['std'] ) ? $args['std'] : '';
		}

		$size = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : 'regular';
		$html = '<input type="text" class="' . $size . '-text" id="' . static::$_prefix . 'settings_' . $args['id'] . '" name="' . static::$_prefix . 'settings[' . $args['id'] . ']" value="' . esc_attr( $value ) . '"/>';

		if ( 'valid' == get_option( $args['options']['is_valid_license_option'] ) ) {
			$html .= '<input type="submit" class="button-secondary" name="' . $args['id'] . '_deactivate" value="' . __( 'Deactivate License', 'content-control' ) . '"/>';
		}
		$html .= '<label class="field-description" for="' . static::$_prefix . 'settings_' . $args['id'] . '"> ' . $args['desc'] . '</label>';

		wp_nonce_field( $args['id'] . '-nonce', $args['id'] . '-nonce' );

		echo $html;
	}

	/**
	 * Hook Callback
	 *
	 * Adds a do_action() hook in place of the field
	 *
	 * @param array $args Arguments passed by the setting
	 *
	 * @return void
	 */
	public static function hook( $args ) {
		do_action( static::$_prefix . $args['id'], $args );
	}

}
