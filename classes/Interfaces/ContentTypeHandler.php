<?php
/**
 * Plugin container.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Interfaces;

defined( 'ABSPATH' ) || exit;

/**
 * Content type handler interface for Restriction processing for different content types.
 *
 * @since 2.4.0
 */
interface ContentTypeHandler {

	/**
	 * Constructor.
	 *
	 * @param \ContentControl\Services\Restrictions $restrictions Restrictions service.
	 *
	 * @return void
	 */
	public function __construct( $restrictions );

	/**
	 * Get the cache key.
	 *
	 * @param int $id Content ID.
	 *
	 * @return string
	 */
	public function get_cache_key( $id );

	/**
	 * Get the applicable restrictions for the content.
	 *
	 * @param int $id Content ID.
	 *
	 * @return array<string,mixed>
	 */
	public function get_applicable_restrictions( $id );

	/**
	 * Get the all applicable restrictions for the content.
	 *
	 * @param int $id Content ID.
	 *
	 * @return array<string,mixed>
	 */
	public function get_all_applicable_restrictions( $id );

	/**
	 * Check if the content has applicable restrictions.
	 *
	 * @param int $id Content ID.
	 *
	 * @return bool
	 */
	public function has_applicable_restrictions( $id );
}
