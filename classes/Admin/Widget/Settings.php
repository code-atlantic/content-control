<?php

namespace JP\CC\Admin\Widget;

use JP\CC\Widget;
use JP\CC\Roles;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class JP\CC\Admin\Widget_Settings
 */
class Settings {

	/**
	 * Initialize Widget Settings
	 */
	public static function init() {
		add_action( 'in_widget_form', array( __CLASS__, 'fields' ), 5, 3 );
		add_filter( 'widget_update_callback', array( __CLASS__, 'save' ), 5, 3 );
	}

	/**
	 * Renders additional widget option fields.
	 *
	 * @param $widget
	 * @param $return
	 * @param $instance
	 */
	public static function fields( $widget, $return, $instance ) {

		$allowed_user_roles = Roles::allowed_user_roles();

		wp_nonce_field( 'jpcc-menu-editor-nonce', 'jpcc-menu-editor-nonce' );

		$which_users_options = array(
			''           => __( 'Everyone', 'content-control' ),
			'logged_out' => __( 'Logged Out Users', 'content-control' ),
			'logged_in'  => __( 'Logged In Users', 'content-control' ),
		);

		$instance = Widget::parse_options( $instance ); ?>

		<p class="widget_options-which_users">

			<label for="<?php echo $widget->get_field_id( 'which_users' ); ?>">

				<?php _e( 'Who can see this widget?', 'content-control' ); ?><br />

				<select name="<?php echo $widget->get_field_name( 'which_users' ); ?>" id="<?php echo $widget->get_field_id( 'which_users' ); ?>" class="widefat">
					<?php foreach ( $which_users_options as $option => $label ) : ?>
						<option value="<?php echo $option; ?>" <?php selected( $option, $instance['which_users'] ); ?>>
							<?php echo esc_html( $label ); ?>
						</option>
					<?php endforeach; ?>
				</select>

			</label>

		</p>

		<p class="widget_options-roles">

			<?php _e( 'Choose which roles can see this widget', 'content-control' ); ?><br />

			<?php foreach ( $allowed_user_roles as $option => $label ) : ?>
				<label>
					<input type="checkbox" name="<?php echo $widget->get_field_name( 'roles' ); ?>[]" value="<?php echo $option; ?>" <?php checked( in_array( $option, $instance['roles'] ), true ); ?>/>
					<?php echo esc_html( $label ); ?>
				</label>
			<?php endforeach; ?>

		</p>

		<?php
	}

	/**
	 * Validates & saves additional widget options.
	 *
	 * @param $instance
	 * @param $new_instance
	 *
	 * @return array|bool
	 */
	public static function save( $instance, $new_instance ) {

		if ( ! isset( $_POST['jpcc-menu-editor-nonce'] ) || ! wp_verify_nonce( $_POST['jpcc-menu-editor-nonce'], 'jpcc-menu-editor-nonce' ) ) {
			return false;
		}

		$new_instance = Widget::parse_options( $new_instance );

		if ( $new_instance['which_users'] == 'logged_in' ) {

			$allowed_roles = Roles::allowed_user_roles();

			// Validate chosen roles and remove non-allowed roles.
			foreach ( (array) $new_instance['roles'] as $key => $role ) {
				if ( ! array_key_exists( $role, $allowed_roles ) ) {
					unset( $new_instance['roles'][ $key ] );
				}
			}

		} else {
			unset( $new_instance['roles'] );
		}

		return $new_instance;
	}

}
