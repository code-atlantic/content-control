<?php
/**
 * Rule engine rule model.
 *
 * @package ContentControl
 * @subpackage Models
 */

namespace ContentControl\Models\RuleEngine;

use ContentControl\Vendor\Pimple\Exception\UnknownIdentifierException;

use function ContentControl\plugin;

/**
 * Handler for condition rules.
 *
 * @package ContentControl
 */
class Rule extends Item {

	/**
	 * Rule id.
	 *
	 * @var string
	 */
	public $id;

	/**
	 * Rule name.
	 *
	 * @var string
	 */
	public $name;

	/**
	 * Rule options.
	 *
	 * @var array
	 */
	public $options;

	/**
	 * Rule not operand.
	 *
	 * @var boolean
	 */
	public $not_operand;

	/**
	 * Rule extras.
	 *
	 * Such as post type or taxnomy like meta.
	 *
	 * @var array
	 */
	public $extras = [];

	/**
	 * Build a rule.
	 *
	 * @param array $rule Rule data.
	 *
	 * @throws \Exception If rule not found.
	 */
	public function __construct( $rule ) {
		$rule = wp_parse_args( $rule, [
			'id'         => '',
			'name'       => '',
			'notOperand' => false,
			'options'    => [],
			'extras'     => [],
		]);

		$name = $rule['name'];

		if ( ! plugin( 'rules' )->get_rule( $name ) ) {
			/* translators: 1. Rule name. */
			throw new \Exception( sprintf( __( 'Rule `%s` not found.', 'content-control' ), $name ) );
		}

		$extras = isset( $this->definition['extras'] ) ? $this->definition['extras'] : [];
		$this->extras        = array_merge( $extras, $rule['extras'] );
	}

	/**
	 * Parse rule options based on rule definitions.
	 *
	 * @param array $options Array of rule opions.
	 * @return array
	 */
	public function parse_options( $options = [] ) {
		return $options;
	}

	/**
	 * Get rule definition.
	 *
	 * @return array|null Rule definition or null.
	 */
	public function get_rule_definition() {
		return plugin( 'rules' )->get_rule( $this->name );
	}

	/**
	 * Check the results of this rule.
	 *
	 * @return bool
	 */
	public function check_rule() {
		if ( $this->is_js_rule() ) {
			return true;
		}

		$definition = $this->get_rule_definition();

		$check = call_user_func( $definition['callback'], $this->options );

		return $this->not_operand ? ! $check : $check;
	}

	/**
	 * Check if this rule's callback is based in JS rather than PHP.
	 *
	 * @return bool
	 */
	public function is_js_rule() {
		$definition = $this->get_rule_definition();

		if ( ! $definition ) {
			return false;
		}

		return ! isset( $definition['callback'] );
	}

	/**
	 * Return the rule check as boolean or null if the rule is JS based.
	 *
	 * @return bool|null
	 */
	public function get_check() {
		if ( $this->is_js_rule() ) {
			return null;
		}

		return $this->check_rule();
	}

	/**
	 * Return the rule check as an array of information.
	 *
	 * Useful for debugging.
	 *
	 * @return array|null
	 */
	public function get_check_info() {
		if ( $this->is_js_rule() ) {
			return null;
		}

		$definition = $this->get_rule_definition();

		$check = call_user_func( $definition['callback'], $this->options );

		return [
			'result' => $check,
			'id'     => $this->id,
			'rule'   => $this->name,
			'not'    => $this->not_operand,
			'args'   => $this->options,
			'def'    => $definition,
		];
	}
}
