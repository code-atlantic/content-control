<?php
/**
 * Rule callback functions.
 *
 * @package ContentControl
 */

namespace ContentControl\Rules;

defined( 'ABSPATH' ) || exit;

use function ContentControl\get_main_wp_query;
use function ContentControl\Rules\is_post_type;
use function ContentControl\Rules\get_rule_extra;
use function ContentControl\Rules\get_rule_option;
use function ContentControl\current_query_context;
use function ContentControl\Rules\allowed_user_roles;

/**
 * Checks if a user has one of the selected roles.
 *
 * @return bool
 *
 * @since 2.0.0
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
 * @uses current_query_context() To get the current query context.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_home_page() {
	global $post;

	$context = current_query_context();

	switch ( $context ) {
		// Check main query.
		case 'main':
		case 'main/blocks':
			$main_query = get_main_wp_query();
			return $main_query->is_front_page();

		// Check based on current post.
		default:
			$page_id = 'page' === get_option( 'show_on_front' ) && get_option( 'page_on_front' ) ? get_option( 'page_on_front' ) : -1;

			return (int) $page_id === (int) $post->ID;
	}
}

/**
 * Check if this is the home page.
 *
 * @uses current_query_context() To get the current query context.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_blog_index() {
	global $post;

	$context = current_query_context();

	switch ( $context ) {
		// Check main query.
		case 'main':
		case 'main/blocks':
			$main_query = get_main_wp_query();
			return $main_query->is_home();

		// Check based on current post.
		default:
			$page_for_posts = 'page' === get_option( 'show_on_front' ) && get_option( 'page_for_posts' ) ? get_option( 'page_for_posts' ) : -1;

			return (int) $page_for_posts === (int) $post->ID;
	}
}

/**
 * Check if this is an archive for a specific post type.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_post_type_archive() {
	$query = get_main_wp_query();

	$post_type = get_rule_extra( 'post_type', '' );

	// For posts we need to check a few different things.
	if ( 'post' === $post_type ) {
		return ( $query->is_home() || $query->is_category() || $query->is_tag() || $query->is_date() || $query->is_author() );
	}

	// Context doesn't matter for this check.
	return $query->is_post_type_archive( $post_type );
}

/**
 * Check if this is a single post for a specific post type.
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_post_type() {
	$context   = current_query_context();
	$post_type = get_rule_extra( 'post_type', '' );

	switch ( $context ) {
		case 'main':
		case 'main/blocks':
			$main_query = get_main_wp_query();
			return $main_query->is_singular( $post_type );

		default:
		case 'main/posts':
		case 'posts':
		case 'blocks':
			return is_post_type( $post_type );
	}
}

/**
 * Check if content is a selected post(s).
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_selected_post() {
	global $post;

	$context = current_query_context();

	$post_type = get_rule_extra( 'post_type', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	switch ( $context ) {
		case 'main':
		case 'main/blocks':
			$main_query = get_main_wp_query();
			return $main_query->is_singular( $post_type ) && in_array( $main_query->get_queried_object_id(), $selected, true );

		default:
		case 'main/posts':
		case 'posts':
		case 'blocks':
			return is_post_type( $post_type ) && in_array( $post->ID, $selected, true );
	}
}

/**
 * Check if the current post is a child of a selected post(s).
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_child_of_post() {
	global $post;

	$context = current_query_context();

	$post_type = get_rule_extra( 'post_type', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	if ( ! \is_post_type_hierarchical( $post_type ) ) {
		return false;
	}

	switch ( $context ) {
		case 'main':
		case 'main/blocks':
			$main_query = get_main_wp_query();
			// Check if current page is a post type.
			if ( ! $main_query->is_singular( $post_type ) ) {
				return false;
			}
			break;

		default:
		case 'main/posts':
		case 'posts':
		case 'blocks':
			// Check if current post is a post type.
			if ( ! is_post_type( $post_type ) ) {
				return false;
			}
			break;
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
 *
 * @since 2.0.0
 */
function content_is_ancestor_of_post() {
	global $post;

	$context = current_query_context();

	$post_type = get_rule_extra( 'post_type', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	if ( ! \is_post_type_hierarchical( $post_type ) ) {
		return false;
	}

	switch ( $context ) {
		case 'main':
		case 'main/blocks':
			$main_query = get_main_wp_query();
			// Check if current page is a post type.
			if ( ! $main_query->is_singular( $post_type ) ) {
				return false;
			}
			break;

		default:
		case 'main/posts':
		case 'posts':
		case 'blocks':
			// Check if current post is a post type.
			if ( ! is_post_type( $post_type ) ) {
				return false;
			}
			break;
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
 *
 * @since 2.0.0
 */
function content_is_post_with_template() {
	global $post;

	$context = current_query_context();

	$selected = get_rule_option( 'selected', [] );

	switch ( $context ) {
		case 'main':
		case 'main/blocks':
			$main_query = get_main_wp_query();

			$page_template = get_page_template_slug( $main_query->get_queried_object_id() );
			break;

		default:
		case 'main/posts':
		case 'posts':
		case 'blocks':
			$page_template = get_page_template_slug( $post->ID );
			break;
	}

	if ( empty( $selected ) ) {
		return (bool) $page_template;
	}

	foreach ( $selected as $template ) {
		if ( $template === $page_template ) {
			return true;
		}
	}

	return false;
}

/**
 * Check if current post has selected taxonomy term(s).
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_post_with_tax_term() {
	global $post;

	$context = current_query_context();

	$post_type = get_rule_extra( 'post_type', '' );
	$taxonomy  = get_rule_extra( 'taxonomy', '' );

	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	switch ( $context ) {
		case 'main':
		case 'main/blocks':
			$main_query = get_main_wp_query();

			if ( ! $main_query->is_singular( $post_type ) ) {
				return false;
			}

			// Ensure we are using the main query object ID.
			$post_id = $main_query->get_queried_object_id();
			break;

		default:
		case 'main/posts':
		case 'posts':
		case 'blocks':
			if ( ! is_post_type( $post_type ) ) {
				return false;
			}

			$post_id = $post->ID;
			break;
	}

	switch ( $taxonomy ) {
		case 'category':
			return \has_category( $selected, $post_id );
		case 'post_tag':
			return \has_tag( $selected, $post_id );
		default:
			return \has_term( $selected, $taxonomy, $post_id );
	}
}

/**
 * Check if current content is a selected taxonomy(s).
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_taxonomy_archive() {
	$taxonomy = get_rule_extra( 'taxonomy', '' );

	$main_query = get_main_wp_query();

	// No context needed, always looking for main query only.
	switch ( $taxonomy ) {
		case 'category':
			return $main_query->is_category();
		case 'post_tag':
			return $main_query->is_tag();
		default:
			return $main_query->is_tax( $taxonomy );
	}
}

/**
 * Check if current content is a selected taxonomy term(s).
 *
 * @return bool
 *
 * @since 2.0.0
 */
function content_is_selected_term() {
	$main_query = get_main_wp_query();

	$taxonomy = get_rule_extra( 'taxonomy', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	switch ( $taxonomy ) {
		case 'category':
			return $main_query->is_category( $selected );
		case 'post_tag':
			return $main_query->is_tag( $selected );
		default:
			return $main_query->is_tax( $taxonomy, $selected );
	}
}
