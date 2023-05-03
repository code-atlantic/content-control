<?php
/**
 * Rule engine rule model.
 *
 * @package ContentControl\RuleEngine
 * @subpackage Models
 */

namespace ContentControl\RuleEngine\Models;

use ContentControl\Vendor\Pimple\Exception\UnknownIdentifierException;

use function ContentControl\plugin;

/**
 * Handler for condition rules.
 *
 * @package ContentControl\RuleEngine
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
		]);

		$name = $rule['name'];

		if ( ! plugin( 'rules' )->get_rule( $name ) ) {
			/* translators: 1. Rule name. */
			throw new \Exception( sprintf( __( 'Rule `%s` not found.', 'content-control' ), $name ) );
		}

		$this->id          = $rule['id'];
		$this->name        = $name;
		$this->not_operand = $rule['notOperand'];
		$this->options     = $this->parse_options( $rule['options'] );
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
	 * Check the results of this rule.
	 *
	 * @return bool
	 */
	public function return_check() {
		// ??
		return true;
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
}
