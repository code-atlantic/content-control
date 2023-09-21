<?php
/**
 * Compatibility functions.
 *
 * @package ContentControl
 */

namespace ContentControl;

/**
 * Returns an array of the default permissions.
 *
 * @return array<string,string> Default permissions.
 */
function get_default_permissions() {
	return [
		// Block Controls.
		'view_block_controls' => 'edit_posts',
		'edit_block_controls' => 'edit_posts',
		// Restrictions.
		'edit_restrictions'   => 'manage_options',
		// Settings.
		'manage_settings'     => 'manage_options',
	];
}

/**
 * Get the default media queries.
 *
 * @return array<string,array{override:bool,breakpoint:int}> Array of media queries.
 */
function get_default_media_queries() {
	return [
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
	];
}

/**
 * Returns an array of the default settings.
 *
 * @return array<string,mixed> Default settings.
 */
function get_default_settings() {
	return [
		'defaultDenialMessage' => '',
		'excludeAdmins'        => true,
		'excludedBlocks'       => [],
		'urlOverrides'         => [],
		'permissions'          => [],
		'mediaQueries'         => get_default_media_queries(),
	];
}

/**
 * Get default restriction settings.
 *
 * @return array<string,mixed> Default restriction settings.
 */
function get_default_restriction_settings() {
	return [
		'userStatus'              => 'logged_in',
		'roleMatch'               => 'any',
		'userRoles'               => [],
		'protectionMethod'        => 'redirect',
		'redirectType'            => 'login',
		'redirectUrl'             => '',
		'replacementType'         => 'message',
		'replacementPage'         => 0,
		'archiveHandling'         => 'filter_post_content',
		'archiveReplacementPage'  => 0,
		'archiveRedirectType'     => 'login',
		'archiveRedirectUrl'      => '',
		'additionalQueryHandling' => 'filter_post_content',
		'showExcerpts'            => false,
		'overrideMessage'         => false,
		'customMessage'           => '',
		'conditions'              => [
			'logicalOperator' => 'and',
			'items'           => [],
		],
	];
}
