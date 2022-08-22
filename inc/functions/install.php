<?php
/**
 * Compatibility functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

/**
 * Returns an array of the default settings.
 *
 * @return array Default settings.
 */
function get_default_settings() {
	return [
		'restrictions'           => [],
		'default_denial_message' => '',
		'overload_login_url'     => false,
		'overload_register_url'  => false,
		'overload_recovery_url'  => false,
	];
};
