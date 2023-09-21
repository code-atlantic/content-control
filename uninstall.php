<?php
/**
 * Content Control Uninstall File
 *
 * @package ContentControl
 */

namespace ContentControl;

/**
 * Uninstall Content Control
 *
 * @return void
 */
function remove_wp_options_data() {
	$keys = [
		'content_control_license',
		'content_control_pro_activation_date',
		'content_control_installed_on',
		'content_control_connect_token',
		'content_control_version',
		'content_control_data_versioning',
		'content_control_debug_log_token', // delete log first.
		'content_control_known_blockTypes',
		'content_control_completed_upgrades',
	];
}
