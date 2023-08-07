<?php
/**
 * Rule callback functions.
 *
 * @package ContentControl
 */

namespace ContentControl\Rules;

use ContentControl\Models\RuleEngine\Rule;
use function ContentControl\plugin;

/**
 * Get the current query.
 *
 * @param \WP_Query|null $query Query object.
 *
 * @return \WP_Query
 */
function get_query( $query = null ) {
	if ( is_null( $query ) ) {
		if ( ! is_null( $GLOBALS['cc_current_query'] ) ) {
			/**
			 * WP Query object.
			 *
			 * @var \WP_Query $query
			 */
			return $GLOBALS['cc_current_query'];
		}

		if ( ! $query && ! is_null( $GLOBALS['wp_query'] ) ) {
			/**
			 * WP Query object.
			 *
			 * @var \WP_Query $query
			 */
			return $GLOBALS['wp_query'];
		}

		if ( ! $query && ! is_null( $GLOBALS['wp_the_query'] ) ) {
			/**
			 * WP Query object.
			 *
			 * @var \WP_Query $query
			 */
			return $GLOBALS['wp_the_query'];
		}
	}

	return $query;
}

/**
 * Get or set the current rule (globaly accessible).
 *
 *  1. Main query is checked in the template_redirect action.
 *  2. Main query posts are checked in the the_posts filter & $wp_query->is_main_query().
 *  3. Alternate query posts are checked in the_posts or pre_get_posts & ! $wp_query->is_main_query().
 *  4. Blocks are checked in the content_control/should_hide_block filter.
 *
 * @param \WP_Query|null $query Query object.
 *
 * @return string 'main', 'main/loop', 'alternate', 'alternate/loop'
 */
function current_query_context( $query = null ) {
	$query = get_query( $query );

	$posts_check = doing_filter( 'pre_get_posts' ) || doing_filter( 'the_posts' );

	$context_checks = [
		// 1. Main query (page/psst/home/search/archive etc) (template_redirect)
		'main'        => $query->is_main_query() && doing_action( 'template_redirect' ),
		// 2. Check posts in the main query. (the_posts)
		'main/posts'  => $query->is_main_query() && $posts_check,
		// 2. Check posts in the other queries. (the_posts)
		'posts'       => ! $query->is_main_query() && $posts_check,
		// 4. Blocks in the main page
		'main/blocks' => $query->is_main_query() && doing_filter( 'content_control/should_hide_block' ),
		// 5. Blocks in query posts
		'blocks'      => ! $query->is_main_query() && doing_filter( 'content_control/should_hide_block' ),
	];

	foreach ( $context_checks as $context => $check ) {
		if ( $check ) {
			return $context;
		}
	}
}

/**
 * Set the current rule (globaly accessible).
 *
 * Because we check posts in `the_posts`, we can't trust the global $wp_query
 * has been set yet, so we need to manage global state ourselves.
 *
 * @param string $query WP_Query object.
 *
 * @return void
 */
function set_rules_query( $query ) {
	global $cc_current_query;
	$cc_current_query = $query;
}

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
 * @param array $defaults Default options.
 *
 * @return array
 */
function get_rule_options( $defaults = [] ) {
	$rule = current_rule();

	$options = $rule ? $rule->options : [];

	return wp_parse_args( $options, $defaults );
}

/**
 * Get the current rule extras.
 *
 * @return array
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
	return is_object( $post ) && ( is_singular( $post_type ) || $post->post_type === $post_type );
}
