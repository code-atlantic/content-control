<?php

namespace ContentControl\RuleEngine;

/**
 * Handler for condition queries.
 *
 * @package ContentControl\RuleEngine
 */
class Query {

	/**
	 * Query logical comparison operator.
	 *
	 * @var string `and` | `or`
	 */
	public $logical_operator;

	/**
	 * Query items.
	 *
	 * @var Item[]
	 */
	public $items;

	/**
	 * Build a query.
	 *
	 * @param array $query Query data.
	 */
	public function __construct( $query ) {
		$query = wp_parse_args( $query, [
			'logicalOperator' => 'and',
			'items'           => [],
		]);

		$this->logical_operator = $query['logicalOperator'];
		$this->items            = [];

		foreach ( $query['items'] as $item ) {
			$is_group = ( isset( $item['type'] ) && 'group' === $item['type'] )
				|| isset( $item['query'] );

				$this->items[] = $is_group ? new Group( $item ) : new Rule( $item );
		}
	}

	/**
	 * Check if this query has JS based rules.
	 *
	 * @return bool
	 */
	public function has_js_rules() {
		foreach ( $this->items as $item ) {
			if ( $item instanceof Rule ) {
				if ( $item->is_js_rule() ) {
					return true;
				}
			} elseif ( $item instanceof Group ) {
				if ( $item->has_js_rules() ) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Check rules in a recursive nested pattern.
	 *
	 * @return bool
	 */
	public function check_rules() {
		$checks = [];

		foreach ( $this->items as $item ) {
			if ( $item instanceof Rule ) {
				$checks[] = $item->check_rule();
			} elseif ( $item instanceof Group ) {
				$checks[] = $item->check_rules();
			}
		}

		return 'or' === $this->logical_operator
			? in_array( true, $checks, true )
			: ! in_array( false, $checks, true );
	}
}
