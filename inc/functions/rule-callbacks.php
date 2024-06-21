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
use function ContentControl\get_rest_api_intent;
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

	/**
	 * Get the roles that are both enabled and required.
	 *
	 * @var string[] $required_roles
	 */
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
			$post_id = $post && is_a( $post, '\WP_Post' ) ? $post->ID : 0;

			return (int) $page_id === (int) $post_id;
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
			$post_id        = $post && is_a( $post, '\WP_Post' ) ? $post->ID : 0;

			return (int) $page_for_posts === (int) $post_id;
	}
}

/**
 * Check if this is an archive for a specific post type.
 *
 * @return bool
 *
 * @since 2.0.0
 * @since 2.2.0 Added support for REST API.
 */
function content_is_post_type_archive() {
	$context = current_query_context();

	$query = get_main_wp_query();

	$post_type = get_rule_extra( 'post_type', '' );

	switch ( $context ) {
		default:
			// For posts we need to check a few different things.
			if ( 'post' === $post_type ) {
				return ( $query->is_home() || $query->is_category() || $query->is_tag() || $query->is_date() || $query->is_author() );
			}

			// Context doesn't matter for this check.
			return $query->is_post_type_archive( $post_type );

		case 'restapi':
			$rest_intent = get_rest_api_intent();

			if ( 'unknown' === $rest_intent['type'] ) {
				return false;
			}

			if ( ! $rest_intent['index'] ) {
				return false;
			}

			// First be sure this is for a post type of the right kind.
			if ( ! rest_intent_matches_post_type( $post_type, $rest_intent ) ) {
				return false;
			}

			return true;

		case 'restapi/posts':
			// This is for main query only.
			return false;
	}
}

/**
 * Check if this is a single post for a specific post type.
 *
 * @return bool
 *
 * @since 2.0.0
 * @since 2.2.0 Added support for REST API.
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

		case 'restapi':
			$rest_intent = get_rest_api_intent();

			if ( 'unknown' === $rest_intent['type'] ) {
				return false;
			}

			// First be sure this is for a singular post type of the right kind.
			if ( ! rest_intent_matches_post_type( $post_type, $rest_intent ) ) {
				return false;
			}

			if ( true === $rest_intent['index'] ) {
				return true;
			}

			$post_id = $rest_intent['id'] > 0 ? $rest_intent['id'] : 0;

			return get_post_type( $post_id ) === $post_type;

		case 'restapi/posts':
			global $post;

			return $post && $post->post_type === $post_type;
	}
}

/**
 * Check if content is a selected post(s).
 *
 * @return bool
 *
 * @since 2.0.0
 * @since 2.2.0 Added support for REST API.
 */
function content_is_selected_post() {
	global $post;

	$context = current_query_context();

	$post_type = get_rule_extra( 'post_type', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	$post_id = $post && is_a( $post, '\WP_Post' ) ? $post->ID : null;

	switch ( $context ) {
		case 'main':
		case 'main/blocks':
			$main_query = get_main_wp_query();
			return $main_query->is_singular( $post_type ) && in_array( $main_query->get_queried_object_id(), $selected, true );

		default:
		case 'main/posts':
		case 'posts':
		case 'blocks':
			return is_post_type( $post_type ) && in_array( $post_id, $selected, true );

		case 'restapi':
		case 'restapi/posts':
			$rest_intent = get_rest_api_intent();

			if ( 'unknown' === $rest_intent['type'] ) {
				return false;
			}

			if ( ! rest_intent_matches_post_type( $post_type, $rest_intent ) ) {
				return false;
			}

			if ( 'restapi' === $context ) {
				if ( $rest_intent['id'] > 0 ) {
					$post_id = (int) $rest_intent['id'];
				}
			}

			return in_array( $post_id, $selected, true );
	}
}

/**
 * Check if the current post is a child of a selected post(s).
 *
 * @return bool
 *
 * @since 2.0.0
 * @since 2.2.0 Added support for REST API.
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

	$the_post = isset( $post ) ? $post : null;

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
		case 'restapi/posts':
			// Check if current post is a post type.
			if ( ! is_post_type( $post_type ) ) {
				return false;
			}
			break;

		case 'restapi':
			$rest_intent = get_rest_api_intent();

			if ( 'unknown' === $rest_intent['type'] ) {
				return false;
			}

			if ( ! rest_intent_matches_post_type( $post_type, $rest_intent ) ) {
				return false;
			}

			if ( $rest_intent['id'] > 0 ) {
				$the_post = get_post( (int) $rest_intent['id'] );
			}
			break;
	}

	if ( ! $the_post ) {
		return false;
	}

	foreach ( $selected as $id ) {
		if ( $the_post->post_parent === $id ) {
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
 * @since 2.2.0 Added support for REST API.
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

	$the_post = isset( $post ) ? $post : null;

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
		case 'restapi/posts':
			// Check if current post is a post type.
			if ( ! is_post_type( $post_type ) ) {
				return false;
			}
			break;

		case 'restapi':
			$rest_intent = get_rest_api_intent();

			if ( 'unknown' === $rest_intent['type'] ) {
				return false;
			}

			if ( ! rest_intent_matches_post_type( $post_type, $rest_intent ) ) {
				return false;
			}

			if ( $rest_intent['id'] > 0 ) {
				$the_post = get_post( (int) $rest_intent['id'] );
			}

			break;
	}

	// Ancestors of the current page.
	$ancestors = $the_post ? \get_post_ancestors( $the_post->ID ) : [];

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

	$context = current_query_context();

	$selected = get_rule_option( 'selected', [] );

	$page_template = '';

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
			global $post;

			$post_id = $post && is_a( $post, '\WP_Post' ) ? $post->ID : null;

			if ( $post_id ) {
				$page_template = get_page_template_slug( $post_id );
			}
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
 * @since 2.2.0 Added support for REST API.
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

	$post_id = $post && is_a( $post, '\WP_Post' ) ? $post->ID : null;

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

		case 'restapi':
		case 'restapi/posts':
			$rest_intent = get_rest_api_intent();

			if ( 'unknown' === $rest_intent['type'] ) {
				return false;
			}

			// Bail if we didn't detect a post type in the intent, or the post type is not the same as the one we're checking.
			if ( ! rest_intent_matches_post_type( $post_type, $rest_intent ) ) {
				return false;
			}

			if ( 'restapi' === $context ) {
				if ( $rest_intent['id'] > 0 ) {
					$post_id = (int) $rest_intent['id'];
				}
			}
			break;

		default:
		case 'main/posts':
		case 'posts':
		case 'blocks':
			if ( ! is_post_type( $post_type ) ) {
				return false;
			}
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
 * @since 2.2.0 Added support for REST API.
 */
function content_is_taxonomy_archive() {
	// Get settings from the current rule.
	$taxonomy = get_rule_extra( 'taxonomy', '' );

	// Get query context.
	$context = current_query_context();

	switch ( $context ) {
		// Handle detection of rest taxonomy endpoint.
		case 'restapi':
			$rest_intent = get_rest_api_intent();

			if ( 'unknown' === $rest_intent['type'] ) {
				return false;
			}

			return rest_intent_matches_taxonomy( $taxonomy, $rest_intent );

		case 'restapi/terms':
			// This is a term query, so we we aren't checking against a taxonomy archive.
			return false;

		default:
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
}

/**
 * Check if current content is a selected taxonomy term(s).
 *
 * @return bool
 *
 * @since 2.0.0
 * @since 2.2.0 Added support for REST API.
 */
function content_is_selected_term() {
	// Get settings from the current rule.
	$taxonomy = get_rule_extra( 'taxonomy', '' );
	// Handle array of string or int, and comman list.
	$selected = \wp_parse_id_list(
		get_rule_option( 'selected', [] )
	);

	// Get query context.
	$context = current_query_context();

	// Handle detection of rest taxonomy endpoint.
	switch ( $context ) {
		default:
			// Get main query for 'main' context.
			$main_query = get_main_wp_query();

			// Handle everything else.
			switch ( $taxonomy ) {
				case 'category':
					return $main_query->is_category( $selected );
				case 'post_tag':
					return $main_query->is_tag( $selected );
				default:
					return $main_query->is_tax( $taxonomy, $selected );
			}

		case 'terms':
			$term = get_global( 'term' ); // Used instead of global $cc_term.

			// Check if we have a term object from the term query.
			if ( $term && $term->term_id > 0 ) {
				return in_array( (int) $term->term_id, $selected, true );
			}
			break;

			// Handles REST API querys.
		case 'restapi':
		case 'restapi/terms':
			$rest_intent = get_rest_api_intent();
			$term        = get_global( 'term' ); // Used instead of global $cc_term.

			if ( 'unknown' === $rest_intent['type'] ) {
				return false;
			}

			if ( ! rest_intent_matches_taxonomy( $taxonomy, $rest_intent ) ) {
				return false;
			}

			// Check if we have a term ID from the rest intent.
			if ( $rest_intent['id'] > 0 ) {
				return in_array( (int) $rest_intent['id'], $selected, true );
			}

			// Check if we have a term object from the term query.
			if ( $term && $term->term_id > 0 ) {
				return in_array( (int) $term->term_id, $selected, true );
			}

			// Always return false if no ID is set.
			return false;
	}

	return false;
}

/**
 * Check if post type matches.
 *
 * @param string          $type Type to check (post type or taxonomy key).
 * @param string|string[] $matches Type matches against. Array or string of comma separated values.
 *
 * @return bool
 *
 * @since 2.3.0
 */
function check_type_match( $type, $matches ) {
	// Deal with 'any' and 'all' values.
	if (
		// Check if any or all is in $mathces array.
		(
			is_array( $matches ) &&
			(
				in_array( 'any', $matches, true ) ||
				in_array( 'all', $matches, true )
			)
		) ||
		'any' === $matches ||
		'all' === $matches
	) {
		return true;
	}

	if ( is_string( $matches ) ) {
		$matches = explode( ',', $matches );
	}

	return in_array( $type, $matches, true );
}


/**
 * Simplifies checking if a post type matches a rest intent.
 *
 * @param string                             $post_type Post type to check.
 * @param array<string,bool|string|int>|null $rest_intent Rest intent to check.
 *
 * @return bool
 *
 * @since 2.3.0
 */
function rest_intent_matches_post_type( $post_type, $rest_intent = null ) {
	if ( ! $rest_intent ) {
		$rest_intent = get_rest_api_intent();
	}

	// Fill in defaults to prevent errors.
	wp_parse_args( $rest_intent, [
		'type' => '',
		'name' => '',
	] );

	// Check if this is a post type intent.
	if ( 'post_type' !== $rest_intent['type'] ) {
		return false;
	}

	$post_type_object = get_post_type_object( $post_type );

	// Check that rest_base or selected name match.
	return // Check the rest_base for the selected post type matches the intent.
		check_type_match( $post_type_object->rest_base, $rest_intent['name'] ) ||
		// Check the post type matches the intent.
		check_type_match( $post_type, $rest_intent['name'] );
}

/**
 * Simplifies checking if a taxonomy matches a rest intent.
 *
 * @param string                             $taxonomy Taxonomy to check.
 * @param array<string,bool|string|int>|null $rest_intent Rest intent to check.
 *
 * @return bool
 *
 * @since 2.3.0
 */
function rest_intent_matches_taxonomy( $taxonomy, $rest_intent = null ) {
	if ( ! $rest_intent ) {
		$rest_intent = get_rest_api_intent();
	}

	// Fill in defaults to prevent errors.
	wp_parse_args( $rest_intent, [
		'type' => '',
		'name' => '',
	] );

	// Check if this is a taxonomy intent.
	if ( 'taxonomy' !== $rest_intent['type'] ) {
		return false;
	}

	$taxonomy_object = get_taxonomy( $taxonomy );

	// Check that rest_base or selected name match.
	return // Check the rest_base for the selected taxonomy matches the intent.
		check_type_match( $taxonomy_object->rest_base, $rest_intent['name'] ) ||
		// Check the taxonomy matches the intent.
		check_type_match( $taxonomy, $rest_intent['name'] );
}
