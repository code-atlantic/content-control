<?php
/**
 * Admin Widget Editor controller.
 *
 * @note This is only used for the old WP -4.9 widget editor.
 *
 * @package ContentControl\Admin
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl\Controllers\Admin;

use WP_Widget;
use ContentControl\Base\Controller;

use function ContentControl\Rules\allowed_user_roles;
use function ContentControl\Widgets\parse_options as parse_widget_options;

/**
 * WidgetEditor controller class.
 */
class WidgetEditor extends Controller {

	/**
	 * Initialize widget editor UX.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_action( 'in_widget_form', [ $this, 'fields' ], 5, 3 );
		add_filter( 'widget_update_callback', [ $this, 'save' ], 5, 3 );
	}

	/**
	 * Enqueue v1 admin scripts.
	 *
	 * @param mixed $hook Admin page hook name.
	 *
	 * @return void
	 */
	public function enqueue_assets( $hook ) {
		if ( 'widgets.php' === $hook ) {
			wp_enqueue_style( 'content-control-widget-editor' );
			wp_enqueue_script( 'content-control-widget-editor' );
		}
	}

	/**
	 * Renders additional widget option fields.
	 *
	 * @param \WP_Widget          $widget Widget instance.
	 * @param bool                $ret Whether to return the output.
	 * @param array<string,mixed> $instance Widget instance options.
	 *
	 * @return void
	 */
	public function fields( $widget, $ret, $instance ) {
		$allowed_user_roles = allowed_user_roles();

		wp_nonce_field( 'content-control-widget-editor-nonce', 'content-control-widget-editor-nonce' );

		$which_users_options = [
			''           => __( 'Everyone', 'content-control' ),
			'logged_out' => __( 'Logged Out Users', 'content-control' ),
			'logged_in'  => __( 'Logged In Users', 'content-control' ),
		];

		$instance = parse_widget_options( $instance );

		?>
		<p class="widget_options-which_users">
			<label for="<?php echo esc_attr( $widget->get_field_id( 'which_users' ) ); ?>">
				<?php esc_html_e( 'Who can see this widget?', 'content-control' ); ?><br />
				<select name="<?php echo esc_attr( $widget->get_field_name( 'which_users' ) ); ?>" id="<?php echo esc_attr( $widget->get_field_id( 'which_users' ) ); ?>" class="widefat">
					<?php foreach ( $which_users_options as $option => $label ) : ?>
						<option value="<?php echo esc_attr( $option ); ?>" <?php selected( $option, $instance['which_users'] ); ?>>
							<?php echo esc_html( $label ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</label>
		</p>

		<p class="widget_options-roles">
			<?php esc_html_e( 'Choose which roles can see this widget', 'content-control' ); ?><br />
			<?php foreach ( $allowed_user_roles as $option => $label ) : ?>
				<label>
					<input type="checkbox" name="<?php echo esc_attr( $widget->get_field_name( 'roles' ) ); ?>[]" value="<?php echo esc_attr( $option ); ?>" <?php checked( in_array( $option, $instance['roles'], true ), true ); ?>/>
					<?php echo esc_html( $label ); ?>
				</label>
			<?php endforeach; ?>
		</p>
		<?php
	}

	/**
	 * Validates & saves additional widget options.
	 *
	 * @param array<string,mixed> $instance Widget instance options.
	 * @param array<string,mixed> $new_instance New widget instance options.
	 * @param array<string,mixed> $old_instance Old widget instance options.
	 *
	 * @return array<string,mixed>|bool
	 */
	public function save( $instance, $new_instance, $old_instance ) {
		if ( isset( $_POST['content-control-widget-editor-nonce'] ) && wp_verify_nonce( wp_unslash( sanitize_key( $_POST['content-control-widget-editor-nonce'] ) ), 'content-control-widget-editor-nonce' ) ) {
			$new_instance            = parse_widget_options( $new_instance );
			$instance['which_users'] = $new_instance['which_users'];
			$instance['roles']       = $new_instance['roles'];

			if ( 'logged_in' === $instance['which_users'] ) {
				$allowed_roles = allowed_user_roles();

				// Validate chosen roles and remove non-allowed roles.
				foreach ( (array) $instance['roles'] as $key => $role ) {
					if ( ! array_key_exists( $role, $allowed_roles ) ) {
						unset( $instance['roles'][ $key ] );
					}
				}
			} else {
				unset( $instance['roles'] );
			}
		} else {
			// Failed validation, use old instance.
			$old_instance            = parse_widget_options( $old_instance );
			$instance['which_users'] = $old_instance['which_users'];

			if ( empty( $old_instance['roles'] ) ) {
				unset( $instance['roles'] );
			} else {
				$instance['roles'] = $old_instance['roles'];
			}
		}

		return $instance;
	}
}
