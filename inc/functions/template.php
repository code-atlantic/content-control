<?php
/**
 * Restriction utility & helper functions.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl;

/**
 * Get restricted content message.
 *
 * @param int|null $post_id Post ID.
 *
 * @return string
 */
function get_restricted_content_message( $post_id = null ) {
	$restriction = get_applicable_restriction( $post_id );

	if ( ! $restriction ) {
		return '';
	}

	return $restriction->get_message();
}
