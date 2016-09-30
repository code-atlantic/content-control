<?php


namespace JP\CC\Admin\Settings;

use JP\CC\Helpers;
use JP\CC\Options;
use JP\CC\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Restrictions {

	public static function init() {
		add_action( 'jp_cc_restriction_editor', array( __CLASS__, 'restrictions_editor' ) );
	}

	public static function restrictions_editor() {
			$restrictions = Options::get( 'restrictions', array() );

			$restrictions = Helpers::object_to_array( $restrictions );

			// Remove array keys.
			$restrictions = array_values( $restrictions );
			?>
			<script type="text/javascript">
				var jp_cc_restrictions = <?php echo json_encode( $restrictions ); ?>,
					jp_cc_conditions = <?php echo json_encode( Conditions::instance()->get_conditions() ); ?>,
					jp_cc_conditions_selectlist = <?php echo json_encode( Conditions::instance()->conditions_dropdown_list() ); ?>,
					jp_cc_restriction_fields = <?php echo json_encode( static::fields() ); ?>;
			</script>

			<button class="add_new_restriction button" type="button"><?php _e( 'Add a Restriction', 'content-control' ); ?></button>
			<div class="tablenav top">
				<div class="alignleft actions bulkactions">
					<label for="bulk-action-selector-top" class="screen-reader-text"><?php _e( 'Select bulk action', 'content-control' ); ?></label>
					<select id="bulk-action-selector-top">
						<option value="-1"><?php _e( 'Bulk Actions', 'content-control' ); ?></option>
						<option value="trash"><?php _e( 'Move to Trash', 'content-control' ); ?></option>
					</select>
					<input type="button" class="button action" value="<?php _e( 'Apply', 'content-control' ); ?>" />
				</div>
				<br class="clear">
			</div>
			<table id="jp-cc-restrictions" class="wp-list-table widefat fixed striped posts">
				<thead>
				<tr>
					<td id="cb" class="manage-column column-cb check-column">
						<label class="screen-reader-text" for="cb-select-all-1"><?php _e( 'Select All', 'content-control' ); ?></label>
						<input id="cb-select-all-1" type="checkbox" />
				</td>
				<th width="60" id="priority" class="manage-column column-priority" scope="col"><?php _e( 'Priority', 'content-control' ); ?></th>
				<th id="title" class="manage-column column-title column-primary" scope="col"><?php _e( 'Restriction Title', 'content-control' ); ?></th>
				<th id="overview" class="manage-column column-overview" scope="col"><?php _e( 'Overview', 'content-control' ); ?></th>
			</tr>
			</thead>
			<tfoot>
			<tr>
				<td id="cb" class="manage-column column-cb check-column">
					<label class="screen-reader-text" for="cb-select-all-1"><?php _e( 'Select All', 'content-control' ); ?></label>
					<input id="cb-select-all-1" type="checkbox" />
				</td>
				<th id="priority" class="manage-column column-priority" scope="col"><?php _e( 'Priority', 'content-control' ); ?></th>
				<th id="title" class="manage-column column-title column-primary" scope="col"><?php _e( 'Restriction Title', 'content-control' ); ?></th>
				<th id="overview" class="manage-column column-overview" scope="col"><?php _e( 'Overview', 'content-control' ); ?></th>
			</tr>
			</tfoot>
				<tbody class="no-items">
					<tr>
						<td class="colspanchange" colspan="4"><?php _e( 'No restrictions found.', 'content-control' ); ?></td>
					</tr>
				</tbody>
				<tbody class="has-items">
				</tbody>
		</table>
		<div class="tablenav bottom">
			<div class="alignleft actions bulkactions">
				<label for="bulk-action-selector-bottom" class="screen-reader-text">Select bulk action</label><select name="action2" id="bulk-action-selector-bottom">
					<option value="-1"><?php _e( 'Bulk Actions', 'content-control' ); ?></option>
					<option value="trash"><?php _e( 'Move to Trash', 'content-control' ); ?></option>
				</select>
				<input type="button" class="button action" value="<?php _e( 'Apply', 'content-control' ); ?>" />
			</div>
			<br class="clear">
		</div>
		<?php
	}

	public static function fields() {
		return array(
			'general' => array(
				array(
					'type' => 'text',
					'id' => 'title',
					'name' => 'title',
					'label' => __( 'Restriction Title', 'content-control' ),
					'placeholder' => __( 'Pages restricted to logged in users', 'content-control' ),
					'std' => ''
				),
				array(
					'type' => 'select',
					'id' => 'who',
					'name' => 'who',
					'label' => __( 'Who can see this content?', 'content-control' ),
					'std' => '',
					'options' => array(
						//__( "Everyone", 'content-control' ) => '',
						__( "Logged In Users", 'content-control' ) => 'logged_in',
						__( "Logged Out Users", 'content-control' ) => 'logged_out',
					)
				),
				array(
					'type' => 'multicheck',
					'id' => 'roles',
					'name' => 'roles',
					'label' => __( 'Choose which roles can see this content', 'content-control' ),
					'options' => array_flip( \JP\CC\Roles::allowed_user_roles() ),
				),
			),
			'protection' => array(
				array(
					'type' => 'select',
					'id' => 'protection_method',
					'name' => 'protection_method',
					'label' => __( 'Choose how to protect your content', 'content-control' ),
					'options' => array(
						__( 'Custom Message', 'content-control' ) => 'custom_message',
						__( 'Redirect', 'content-control' ) => 'redirect',
					),
					'std' => 'redirect',
				),
				array(
					'type' => 'checkbox',
					'id' => 'show_excerpts',
					'name' => 'show_excerpts',
					'classes' => 'protection_method--custom_message',
					'label' => __( 'Show excerpts above access denied message?', 'content-control' ),
				),
				array(
					'type' => 'checkbox',
					'id' => 'override_default_message',
					'name' => 'override_default_message',
					'classes' => 'protection_method--custom_message',
					'label' => __( 'Override the default message?', 'content-control' ),
				),
				array(
					'type' => 'editor',
					'id' => 'custom_message',
					'name' => 'custom_message',
					'classes' => array(
						'protection_method--custom_message',
						'override_default_message--checked',
					),
					'label' => __( 'Enter a custom message to display to restricted users', 'content-control' ),
				),
				array(
					'type' => 'select',
					'id' => 'redirect_type',
					'name' => 'redirect_type',
					'label' => __( 'Where will they be taken?', 'content-control' ),
					'classes' => 'protection_method--redirect',
					'options' => array(
						__( 'Login & Back', 'content-control' ) => 'login',
						__( 'Home Page', 'content-control' ) => 'home',
						__( 'Custom URL', 'content-control' ) => 'custom',
					),
					'std' => 'login',
				),
				array(
					'type' => 'link',
					'id' => 'redirect_url',
					'name' => 'redirect_url',
					'classes' => 'redirect_type--custom',
					'label' => __( 'Redirect URL', 'content-control' ),
					'placeholder' => __( 'http://example.com', 'content-control' ),
					'std' => '',
				),
			),
			'content' => array(
				array(
					'type' => 'conditions',
					'id' => 'conditions',
					'name' => 'conditions'
				)
			),
		);
	}

}
