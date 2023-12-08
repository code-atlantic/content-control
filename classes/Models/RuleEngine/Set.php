<?php
/**
 * Rule engine set model.
 *
 * @package ContentControl
 * @subpackage Models
 */

namespace ContentControl\Models\RuleEngine;

/**
 * Handler for condition sets.
 *
 * @package ContentControl
 */
class Set {

	/**
	 * Set id.
	 *
	 * @var string
	 */
	public $id;

	/**
	 * Set label.
	 *
	 * @var string
	 */
	public $label;

	/**
	 * Set query.
	 *
	 * @var Query
	 */
	public $query;

	/**
	 * Build a set.
	 *
	 * @param array{id:string,label:string,query:array<mixed>} $set Set data.
	 */
	public function __construct( $set ) {
		$set = wp_parse_args( $set, [
			'id'    => '',
			'label' => '',
			'query' => [],
		]);

		$this->id    = $set['id'];
		$this->label = $set['label'];
		$this->query = new Query( $set['query'] );
	}

	/**
	 * Check if this set has JS based rules.
	 *
	 * @return bool
	 */
	public function has_js_rules() {
		return $this->query->has_js_rules();
	}

	/**
	 * Check this sets rules.
	 *
	 * @return bool
	 */
	public function check_rules() {
		return $this->query->check_rules();
	}

	/**
	 * Get the check array for further post processing.
	 *
	 * @return array<bool|null|array<bool|null>>
	 */
	public function get_checks() {
		return $this->query->get_checks();
	}

	/**
	 * Return the checks as an array of information.
	 *
	 * Useful for debugging.
	 *
	 * @return array<string,mixed>
	 */
	public function get_check_info() {
		return $this->query->get_check_info();
	}
}
