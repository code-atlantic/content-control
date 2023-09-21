<?php
/**
 * Rule engine item model.
 *
 * @package ContentControl
 * @subpackage Models
 */

namespace ContentControl\Models\RuleEngine;

/**
 * Handler for condition items.
 *
 * @package ContentControl
 */
abstract class Item {

	/**
	 * Item id.
	 *
	 * @var string
	 */
	public $id;

	/**
	 * Return the checks as an array of information.
	 *
	 * Useful for debugging.
	 *
	 * @return array<mixed>
	 */
	abstract public function get_check_info();
}
