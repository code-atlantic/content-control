<?php
/**
 * Deprecated filters & functions.
 *
 * @package ContentControl
 * @subpackage Deprecated
 * @since 2.0.0
 * @copyright (c) 2023 Code Atlantic LLC
 */

// phpcs:disable Universal.Files.SeparateFunctionsFromOO.Mixed

use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

require_once 'deprecated/class.is.php';
require_once 'deprecated/class.restrictions.php';

/**
 * Class JP_Content_Control
 *
 * @deprecated 2.0.0 Use \ContentControl\Plugin instead.
 */
class JP_Content_Control {}

/**
 * Get the Content Control plugin instance.
 *
 * @deprecated 2.0.0 Use \ContentControl\plugin() instead.
 *
 * @return \ContentControl\Plugin\Core
 */
function jp_content_control() {
	return \ContentControl\plugin();
}

add_filter( 'content_control/rule_engine/deprecated_rules', function ( $conditions ) {
	if ( has_filter( 'jp_cc_registered_conditions' ) ) {
		plugin( 'logging' )->log_deprecated_notice( 'filter:jp_cc_registered_conditions', '2.0.0', 'filter:content_control/rule_engine/deprecated_rules' );
		/**
		 * Filter the registered conditions.
		 *
		 * @deprecated 2.0.0
		 *
		 * @param boolean $conditions Registered conditions.
		 */
		return apply_filters( 'jp_cc_registered_conditions', $conditions );
	}

	return $conditions;
}, 9 );

add_filter( 'content_control/user_roles', function ( $roles ) {
	if ( has_filter( 'jp_cc_user_roles' ) ) {
		plugin( 'logging' )->log_deprecated_notice( 'filter:jp_cc_user_roles', '2.0.0', 'filter:content_control/user_roles' );
		/**
		 * Filter the user roles that our plugin should consider.
		 *
		 * @deprecated 2.0.0
		 *
		 * @param array $roles Roles that our plugin should consider.
		 */
		return apply_filters( 'jp_cc_user_roles', $roles );
	}

	return $roles;
}, 9 );

add_filter( 'content_control/restricted_post_content', function ( $message ) {
	if ( has_filter( 'jp_cc_restricted_message' ) ) {
		plugin( 'logging' )->log_deprecated_notice( 'filter:jp_cc_restricted_message', '2.0.0', 'filter:content_control/restricted_post_content' );
		/**
		 * Filter the restricted message.
		 *
		 * @deprecated 2.0.0
		 *
		 * @param string $message
		 */
		return apply_filters( 'jp_cc_restricted_message', $message );
	}

	return $message;
}, 9 );

add_filter( 'content_control/should_exclude_widget', function ( $should_exclude ) {
	if ( has_filter( 'jp_cc_should_exclude_widget' ) ) {
		plugin( 'logging' )->log_deprecated_notice( 'filter:jp_cc_should_exclude_widget', '2.0.0', 'filter:content_control/should_exclude_widget' );
		/**
		 * Filter if the widget should be excluded.
		 *
		 * @deprecated 2.0.0
		 *
		 * @param boolean $should_exclude
		 */
		return apply_filters( 'jp_cc_should_exclude_widget', $should_exclude );
	}

	return $should_exclude;
}, 9 );

add_filter( 'content_control/excerpt_length', function ( $length = 50 ) {
	if ( has_filter( 'jp_cc_filter_excerpt_length' ) ) {
		plugin( 'logging' )->log_deprecated_notice( 'filter:jp_cc_filter_excerpt_length', '2.0.0', 'filter:content_control/excerpt_length' );
		/**
		 * Filter the excerpt length.
		 *
		 * @deprecated 2.0.0
		 *
		 * @param array $settings
		 */
		return apply_filters( 'jp_cc_filter_excerpt_length', $length );
	}

	return $length;
}, 9 );
