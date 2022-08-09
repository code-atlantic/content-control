<?php

namespace ContentControl\RuleEngine;

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
	 * @param array  $sets Set data.
	 * @param string $any_all_none Whether require `any`|`all`|`none` sets to pass checks.
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
			$checks[] = $set->check_rules();
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
