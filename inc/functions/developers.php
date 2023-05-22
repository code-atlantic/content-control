<?php
/**
 * Restriction utility & helper functions.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl;

use function ContentControl\plugin;

defined( 'ABSPATH' ) || exit;

/**
 * Check and overload global post if needed.
 *
 * @param int|null $post_id Post ID.
 * @return bool
 */
function setup_post( $post_id = null ) {
	global $post;

	$overload_post = isset( $post_id ) &&
		( is_object( $post_id ) && $post_id->ID !== $post->ID ) ||
		( is_int( $post_id ) && $post_id !== $post->ID );

	if ( $overload_post ) {
        // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$post = get_post( $post_id );
		setup_postdata( $post );
	}

	return $overload_post;
}

/**
 * Check and clear global post if needed.
 *
 * @param bool $overload_post Whether post was overloaded.
 * @return void
 */
function clear_post( $overload_post = false ) {
	if ( $overload_post ) {
		// Reset global post object.
		wp_reset_postdata();
	}
}

/**
 * Check if content has restrictions.
 *
 * @param int|null $post_id Post ID.
 * @return bool
 */
function content_has_restrictions( $post_id = null ) {
	$overload_post = setup_post( $post_id );

	$has_restrictions = plugin( 'restrictions' )->has_applicable_restrictions();

	// Clear post if we overloaded it.
	clear_post( $overload_post );

	/**
	 * Filter whether content has restrictions.
	 *
	 * @param bool $has_restrictions Whether content has restrictions.
	 * @param int|null $post_id Post ID.
	 *
	 * @return bool
	 */
	return (bool) apply_filters( 'content_control/content_has_restriction', $has_restrictions, $post_id );
}

/**
 * Get applicable restriction.
 *
 * @param int|null $post_id Post ID.
 * @return \ContentControl\Restrictions\Restriction|false
 */
function get_applicable_restriction( $post_id = null ) {
	$overload_post = setup_post( $post_id );

	$restriction = plugin( 'restrictions' )->get_applicable_restriction();

	// Clear post if we overloaded it.
	clear_post( $overload_post );

	return $restriction;
}

/**
 * Check if user can view content.
 *
 * @param int|null $post_id Post ID.
 * @return bool True if user meets requirements, false if not.
 */
function user_can_view_content( $post_id = null ) {
	$overload_post = setup_post( $post_id );

	if ( ! content_has_restrictions( $post_id ) ) {
		return true;
	}

	$restriction = plugin( 'restrictions' )->get_applicable_restriction();
	$can_view    = $restriction->user_meets_requirements();

	// Clear post if we overloaded it.
	clear_post( $overload_post );

	/**
	 * Filter whether user can view content.
	 *
	 * @param bool $can_view Whether user can view content.
	 * @param int|null $post_id Post ID.
	 *
	 * @return bool
	 */
	return (bool) apply_filters( 'content_control/user_can_view_content', $can_view, $post_id );
}

/**
 * Check if the current post is restricted.
 *
 * @param int|null $post_id Post ID.
 *
 * @return bool
 */
function content_is_restricted( $post_id = null ) {
	$is_restricted = content_has_restrictions( $post_id ) && ! user_can_view_content( $post_id );

	/**
	 * Filter whether content is restricted.
	 *
	 * @param bool $is_restricted Whether content is restricted.
	 * @param int|null $post_id Post ID.
	 *
	 * @return bool
	 */
	return (bool) apply_filters( 'content_control/content_is_restricted', $is_restricted, $post_id );
}

/**
 * Get restricted content message.
 *
 * @param int|null $post_id Post ID.
 * @return string
 */
function get_restricted_content_message( $post_id = null ) {
	$restriction = get_applicable_restriction( $post_id );

	if ( ! $restriction ) {
		return '';
	}

	return $restriction->get_message();
}

/**
 * Check if protection methods should be disabled.
 *
 * Generally used to bypass protections when using page editors.
 *
 * @return bool
 */
function protection_is_disabled() {
	$checks = [
		is_preview() && current_user_can( 'edit_post', get_the_ID() ),
		did_action( 'elementor/loaded' ) && class_exists( '\Elementor\Plugin' ) && isset( \Elementor\Plugin::$instance ) && isset( \Elementor\Plugin::$instance->preview ) && method_exists( \Elementor\Plugin::$instance->preview, 'is_preview_mode' ) && \Elementor\Plugin::$instance->preview->is_preview_mode(),
	];

	return in_array( true, $checks, true );
}
