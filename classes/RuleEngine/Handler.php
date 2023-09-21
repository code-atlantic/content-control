<?php
/**
 * Rule engine handler.
 *
 * @package ContentControl\RuleEngine
 */

namespace ContentControl\RuleEngine;

use ContentControl\Models\RuleEngine\Set;

/**
 * Handler for rule engine.
 *
 * @package ContentControl\RuleEngine
 */
class Handler {

	/**
	 * All sets for this handler.
	 *
	 * @var Set[]
	 */
	public $sets;

	/**
	 * Whether check requires `any`|`all`|`none` sets to pass.
	 *
	 * @var string
	 */
	public $any_all_none;

	/**
	 * Build a list of sets.
	 *
	 * @param array{id:string,label:string,query:array<mixed>}[] $sets Set data.
	 * @param string                                             $any_all_none Whether require `any`|`all`|`none` sets to pass checks.
	 */
	public function __construct( $sets, $any_all_none = 'all' ) {
		$this->any_all_none = $any_all_none;
		$this->sets         = [];

		foreach ( $sets as $set ) {
			$this->sets[] = new Set( $set );
		}
	}

	/**
	 * Check if this set has JS based rules.
	 *
	 * @return bool
	 */
	public function has_js_rules() {
		foreach ( $this->sets as $set ) {
			if ( $set->has_js_rules() ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Checks the rules of all sets using the any/all comparitor.
	 *
	 * @return boolean
	 */
	public function check_rules() {
		$checks = [];

		foreach ( $this->sets as $set ) {
			$check = $set->check_rules();
			// We try to bail early, but just in case we'll add it to the array.
			$checks[] = $check;

			// Bail early if we're checking for all and found one that failed.
			if ( 'all' === $this->any_all_none && false === $check ) {
				return false;
			}

			// Bail early if we're checking for any and found one.
			if ( 'any' === $this->any_all_none && true === $check ) {
				return true;
			}

			// Bail early if we're checking for none and found one.
			if ( 'none' === $this->any_all_none && true === $check ) {
				return false;
			}
		}

		switch ( $this->any_all_none ) {
			case 'any':
				return in_array( true, $checks, true );
			case 'all':
			default:
				return ! in_array( false, $checks, true );
			case 'none':
				return ! in_array( true, $checks, true );
		}
	}
}
