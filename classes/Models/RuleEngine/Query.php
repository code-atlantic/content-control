<?php
/**
 * Rule engine query model.
 *
 * @package ContentControl
 * @subpackage Models
 */

namespace ContentControl\Models\RuleEngine;

/**
 * Handler for condition queries.
 *
 * @package ContentControl
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
	 * @param array{logicalOperator:string,items:array<mixed>} $query Query data.
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
	 * Check if this query has any rules.
	 *
	 * @return bool
	 */
	public function has_rules() {
		return ! empty( $this->items );
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

		if ( empty( $this->items ) ) {
			return true;
		}

		foreach ( $this->items as $item ) {
			// Missing rules should result in restricted content.
			$result = false;

			if ( $item instanceof Rule ) {
				$result = $item->check_rule();
			} elseif ( $item instanceof Group ) {
				$result = $item->check_rules();
			}

			$checks[] = $result;

			// Bail as early as we can.
			if (
				// If we have a true result and are using `or`.
				( true === $result && 'or' === $this->logical_operator ) ||
				// If we have a false result and are using `and`.
				( false === $result && 'and' === $this->logical_operator )
			) {
				break;
			}
		}

		/*
		 * This method ignores null values (JS conditions),
		 * if changed, null needs to be accounted for.
		 */
		if ( 'or' === $this->logical_operator ) {
			// If any values are true or null, return true.
			return in_array( true, $checks, true );
		} else {
			// If any values are false, return false.
			return ! in_array( false, $checks, true );
		}
	}

	/**
	 * Return the checks as an array.
	 *
	 * Useful for debugging or passing to JS.
	 *
	 * @return array<bool|null|array<bool|null>>
	 */
	public function get_checks() {
		$checks = [];

		foreach ( $this->items as $item ) {
			if ( $item instanceof Rule ) {
				$checks[] = $item->get_check();
			} elseif ( $item instanceof Group ) {
				$checks[] = $item->get_checks();
			}
		}

		return $checks;
	}

	/**
	 * Return the checks as an array of information.
	 *
	 * Useful for debugging.
	 *
	 * @return array<mixed>
	 */
	public function get_check_info() {
		$checks = [];

		foreach ( $this->items as $key => $item ) {
			$checks[ $key ] = $item->get_check_info();
		}

		return $checks;
	}
}
