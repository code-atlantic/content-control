<?php
/**
 * Rule callback functions.
 *
 * @package ContentControl
 */

namespace ContentControl\Rules;

use ContentControl\Models\RuleEngine\Rule;
use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Get or set the current rule (globaly accessible).
 *
 * @param Rule|null|false $rule Rule object.
 * @return Rule|null
 */
function current_rule( $rule = false ) {
	return plugin( 'rules' )->current_rule( $rule );
}

/**
 * Get the current rule ID.
 *
 * @return string
 */
function get_rule_id() {
	$rule = current_rule();

	return $rule ? $rule->id : '';
}

/**
 * Get the current rule name.
 *
 * @return string
 */
function get_rule_name() {
	$rule = current_rule();

	return $rule ? $rule->name : '';
}

/**
 * Get the current rule options.
 *
 * @param array<string,mixed> $defaults Default options.
 *
 * @return array<string,mixed>
 */
function get_rule_options( $defaults = [] ) {
	$rule = current_rule();

	$options = $rule ? $rule->options : [];

	return wp_parse_args( $options, $defaults );
}

/**
 * Get the current rule extras.
 *
 * @return array<string,mixed>
 */
function get_rule_extras() {
	$rule = current_rule();

	return $rule ? $rule->extras : [];
}

/**
 * Get the current rule option.
 *
 * @param string $key Option key.
 * @param mixed  $default_value Default value.
 * @return mixed
 */
function get_rule_option( $key, $default_value = false ) {
	$options = get_rule_options();

	return isset( $options[ $key ] ) ? $options[ $key ] : $default_value;
}

/**
 * Get the current rule extra.
 *
 * @param string $key Extra key.
 * @param mixed  $default_value Default value.
 * @return mixed
 */
function get_rule_extra( $key, $default_value = false ) {
	$extras = get_rule_extras();

	return isset( $extras[ $key ] ) ? $extras[ $key ] : $default_value;
}

/**
 * Gets a filterable array of the allowed user roles.
 *
 * @return array|mixed
 */
function allowed_user_roles() {
	static $roles;

	if ( ! isset( $roles ) ) {
		/**
		 * Filter the allowed user roles.
		 *
		 * @param array $roles
		 *
		 * @return array
		 */
		$roles = apply_filters( 'content_control/user_roles', wp_roles()->get_names() );

		if ( ! is_array( $roles ) || empty( $roles ) ) {
			$roles = [];
		}
	}

	return $roles;
}

/**
 * Checks if the current post is a post type.
 *
 * @param string $post_type Post type slug.
 * @return boolean
 */
function is_post_type( $post_type ) {
	global $post;

	if ( ! is_a( $post, '\WP_Post' ) ) {
		return false;
	}

	return is_singular( $post_type ) || $post->post_type === $post_type;
}
