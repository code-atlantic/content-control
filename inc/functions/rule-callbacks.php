<?php
/**
 * Rule callback functions.
 *
 * @package ContentControl
 */

namespace ContentControl\Rules;

defined( 'ABSPATH' ) || exit;

use function ContentControl\Rules\allowed_user_roles;
use function ContentControl\Rules\is_post_type;
use function ContentControl\Rules\get_rule_option;
use function ContentControl\Rules\get_rule_extra;

/**
 * Checks if a user has one of the selected roles.
 *
 * @return bool
 */
function user_has_role() {
	if ( ! \is_user_logged_in() ) {
		return false;
	}

	// Get rules from the current rule.
	$roles = get_rule_option( 'roles', [] );

	if ( ! count( $roles ) ) {
		return true;
	}

	// Get Enabled Roles to check for.
	$user_roles = array_keys( allowed_user_roles() );

	// Get the roles that are both enabled and required.
	$required_roles = array_intersect( $user_roles, $roles );

	if ( count( $required_roles ) === 0 ) {
		return true;
	}

	// Check if the user has one of the required roles.
	foreach ( $required_roles as $role ) {
		if ( \current_user_can( $role ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Check if this is the home page.
 *
 * @return bool
 */
function content_is_home_page() {
	$checks = [
		\is_front_page(),
		\is_main_query(),
	];

	if ( 'content_control/should_hide_block' === \current_filter() ) {
		// Checking block visibility, in the loop.
		$checks[] = \in_the_loop();
	} else {
		// Checking current page, globally, not in the loop.
		$checks[] = ! \in_the_loop();
	}

	return ! in_array( false, $checks, true );
}

/**
 * Check if this is the home page.
 *
 * @return bool
 */
function content_is_blog_index() {
	return \is_home() && \is_main_query() && ! \in_the_loop();
}

/**
 * Check if this is an archive for a specific post type.
 *
 * @return bool
 */
function content_is_post_type_archive() {
	$post_type = get_rule_extra( 'post_type', '' );

	return \is_post_type_archive( $post_type );
}

/**
 * Check if this is a single post for a specific post type.
 *
 * @return bool
 */
function content_is_post_type() {
	$post_type = get_rule_extra( 'post_type', '' );

	return is_post_type( $post_type ) ||
			( 'page' === $post_type && \is_front_page() );
}

/**
 * Check if content is a selected post(s).
 *
 * @return bool
 */
function content_is_selected_post() {
	global $post;

	$context = current_query_context();

	$post_type = get_rule_extra( 'post_type', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	$check = is_post_type( $post_type ) && in_array( $post->ID, $selected, true );

	if ( 'main' === $context ) {
		// If this is the main query, then we can check if the post is in the main query.
		return $check && \is_singular( $post_type );
	}

	return $check;
}

/**
 * Check if the current post is a child of a selected post(s).
 *
 * @return bool
 */
function content_is_child_of_post() {
	global $post;

	$post_type = get_rule_extra( 'post_type', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	if ( ! \is_post_type_hierarchical( $post_type ) || ! \is_singular( $post_type ) ) {
		return false;
	}

	foreach ( $selected as $id ) {
		if ( $post->post_parent === $id ) {
			return true;
		}
	}

	return false;
}

/**
 * Check if the current post is a ancestor of a selected post(s).
 *
 * @return bool
 */
function content_is_ancestor_of_post() {
	global $post;

	$post_type = get_rule_extra( 'post_type', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	// If the current post is not hierarchical, or not a singular post of the given type, return false.
	if ( ! \is_post_type_hierarchical( $post_type ) || ! \is_singular( $post_type ) ) {
		return false;
	}

	// Ancestors of the current page.
	$ancestors = \get_post_ancestors( $post->ID );

	foreach ( $selected as $id ) {
		if ( in_array( $id, $ancestors, true ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Check if current post uses selected template(s).
 *
 * @return bool
 */
function content_is_post_with_template() {
	$selected = get_rule_option( 'selected', [] );

	if ( \is_page() && \is_page_template( $selected ) ) {
		return true;
	}
}

/**
 * Check if current post has selected taxonomy term(s).
 *
 * @return bool
 */
function content_is_post_with_tax_term() {
	$post_type = get_rule_extra( 'post_type', '' );
	$taxonomy  = get_rule_extra( 'taxonomy', '' );

	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	if ( ! is_post_type( $post_type ) ) {
		return false;
	}

	switch ( $taxonomy ) {
		case 'category':
			return \has_category( $selected );
		case 'post_tag':
			return \has_tag( $selected );
		default:
			return \has_term( $selected, $taxonomy );
	}

	return false;
}

/**
 * Check if current content is a selected taxonomy(s).
 *
 * @return bool
 */
function content_is_taxonomy_archive() {
	$taxonomy = get_rule_extra( 'taxonomy', '' );

	switch ( $taxonomy ) {
		case 'category':
			return \is_category();
		case 'post_tag':
			return \is_tag();
		default:
			return \is_tax( $taxonomy );
	}

	return false;
}

/**
 * Check if current content is a selected taxonomy term(s).
 *
 * @return bool
 */
function content_is_selected_term() {
	$taxonomy = get_rule_extra( 'taxonomy', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	switch ( $taxonomy ) {
		case 'category':
			return \is_category( $selected );
		case 'post_tag':
			return \is_tag( $selected );
		default:
			return \is_tax( $taxonomy, $selected );
	}

	return false;
}
