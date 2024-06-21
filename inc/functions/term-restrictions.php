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
 * Check if term has restrictions.
 *
 * @param int|null $term_id Term ID.
 *
 * @return bool
 *
 * @since 2.4.0
 */
function term_has_restrictions( $term_id = null ) {
	$overload_term = setup_term_globals( $term_id );

	$has_restrictions = plugin( 'restrictions' )->has_applicable_restrictions( $term_id );

	// Clear post if we overloaded it.
	if ( $overload_term ) {
		reset_term_globals();
	}

	/**
	 * Filter whether term has restrictions.
	 *
	 * @param bool $has_restrictions    Whether post has restrictions.
	 * @param int|null $term_id         Term ID.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	return (bool) apply_filters( 'content_control/term_has_restrictions', $has_restrictions, $term_id );
}
