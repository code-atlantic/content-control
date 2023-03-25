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
		// New Settings.
		'excludedBlocks' => [],
		'urlOverrides' => [],
		'permissions'            => [
			// Block Controls.
			'viewBlockControls' => [ 'cap' => 'manage_options' ],
			'editBlockControls' => [ 'cap' => 'manage_options' ],
			// Restrictions.
			'addRestriction'    => [ 'cap' => 'manage_options' ],
			'deleteRestriction' => [ 'cap' => 'manage_options' ],
			'editRestriction'   => [ 'cap' => 'manage_options' ],
			// Settings.
			'viewSettings'      => [ 'cap' => 'manage_options' ],
			'manageSettings'    => [ 'cap' => 'manage_options' ],
		],
		'mediaQueries'           => [
			'mobile'  => [
				'override'   => false,
				'breakpoint' => 640,
			],
			'tablet'  => [
				'override'   => false,
				'breakpoint' => 920,
			],
			'desktop' => [
				'override'   => false,
				'breakpoint' => 1440,
			],
		],
	];
}
