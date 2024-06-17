<?php
/**
 * Restriction utility functions for post types.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl;

/**
 * Check if post has restrictions.
 *
 * @param int|null $post_id Post ID.
 *
 * @return bool
 *
 * @since 2.4.0
 */
function post_has_restrictions( $post_id = null ) {
	$overload_post = setup_post_globals( $post_id );

	$has_restrictions = plugin( 'restrictions' )->has_applicable_restrictions( $post_id );

	// Clear post if we overloaded it.
	if ( $overload_post ) {
		reset_post_globals();
	}

	/**
	 * Filter whether post has restrictions.
	 *
	 * @param bool $has_restrictions    Whether post has restrictions.
	 * @param int|null $post_id Post    ID.
	 *
	 * @return bool
	 *
	 * @since 2.4.0
	 */
	return (bool) apply_filters( 'content_control/post_has_restrictions', $has_restrictions, $post_id );
}
