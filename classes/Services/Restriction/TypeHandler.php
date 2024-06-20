<?php
/**
 * Plugin container.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 *
 * @package ContentControl
 */

namespace ContentControl\Services\Restriction;

use ContentControl\Interfaces\ContentTypeHandler;
use ContentControl\Models\Restriction;

defined( 'ABSPATH' ) || exit;

/**
 * Content type handler interface for Restriction processing for different content types.
 *
 * @since 2.4.0
 */
abstract class TypeHandler implements ContentTypeHandler {

	/**
	 * Restrictions service.
	 *
	 * @var \ContentControl\Services\Restrictions
	 */
	private $restrictions;

	/**
	 * TypeHandler constructor.
	 *
	 * @param \ContentControl\Services\Restrictions $restrictions Restrictions service.
	 *
	 * @return void
	 */
	public function __construct( $restrictions ) {
		$this->restrictions = $restrictions;
	}

	/**
	 * Get the restrictions service.
	 *
	 * @return array<int,Restriction>
	 */
	public function get_restrictions() {
		return $this->restrictions->get_restrictions();
	}

	/**
	 * Get the cache key for the current restriction.
	 *
	 * @param int $id Content ID.
	 *
	 * @return string
	 */
	abstract public function get_cache_key( $id );

	/**
	 * Get the applicable restrictions for the current content.
	 *
	 * @param int $id Content ID.
	 *
	 * @return \ContentControl\Models\Restriction[]
	 */
	abstract public function get_applicable_restrictions( $id );

	/**
	 * Get all applicable restrictions for the current content.
	 *
	 * @param int $id Content ID.
	 *
	 * @return \ContentControl\Models\Restriction[]
	 */
	abstract public function get_all_applicable_restrictions( $id );

	/**
	 * Check if the current content has any applicable restrictions.
	 *
	 * @param int $id Content ID.
	 *
	 * @return bool
	 */
	abstract public function has_applicable_restrictions( $id );
}
