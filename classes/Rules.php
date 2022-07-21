<?php
/**
 * Rule registery
 *
 * @package ContentControl
 */

namespace ContentControl;

/**
 * Rules registry
 */
class Rules {

	/**
	 * Array of rules.
	 *
	 * @var array
	 */
	public $data = [];

	/**
	 * Rules constructor.
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Set up rules list.
	 *
	 * @return void
	 */
	public function init() {
		$rules = $this->get_built_in_rules();

		$old_rules = \ContentControl\Conditions::instance()->get_conditions();

		if ( ! empty( $old_rules ) ) {
			$old_rules = $this->parse_old_rules( $old_rules );

			foreach ( $old_rules as $key => $rule ) {
				if ( ! isset( $rules[ $key ] ) ) {
					$rules[ $key ] = $rule;
				}
			}
		}

		foreach ( $rules as $rule ) {
			$this->register_rule( $rule );
		}
	}

	/**
	 * Register new rule type.
	 *
	 * @param array $rule New rule to register.
	 * @return void
	 */
	public function register_rule( $rule ) {
		if ( $this->is_rule_valid( $rule ) ) {
			$rule = wp_parse_args( $rule, $this->get_rule_defaults() );

			$index = $rule['name'];
			/**
			 * In the case multiple conditions are registered with the same
			 * identifier, we append an integer. This do/while quickly increases
			 * the integer by one until a valid new key is found.
			 */
			if ( array_key_exists( $index, $this->data ) ) {
				$i = 0;
				do {
					$i++;
					$index = $rule['name'] . '-' . $i;
				} while ( array_key_exists( $index, $this->data ) );
			}

			$indexs[]             = $index;
			$this->data[ $index ] = $rule;
		}
	}

	/**
	 * Check if rule is valid.
	 *
	 * @param array $rule Rule to test.
	 * @return boolean
	 */
	public function is_rule_valid( $rule ) {
		return true;
	}

	/**
	 * Get array of all registered rules.
	 *
	 * @return array
	 */
	public function get_rules() {
		return $this->data;
	}

	/**
	 * Get array of registered rules filtered for the block-editor.
	 *
	 * @return array
	 */
	public function get_block_editor_rules() {
		$rules = $this->get_rules();

		return apply_filters( 'contctrl_block_editor_rules', $rules );
	}

	/**
	 * Get list of verbs.
	 *
	 * @return array List of verbs with translatable text.
	 */
	public function get_verbs() {
		return [
			'are'         => __( 'Are', 'content-control' ),
			'arenot'      => __( 'Are Not', 'content-control' ),
			'is'          => __( 'Is', 'content-control' ),
			'isnot'       => __( 'Is Not', 'content-control' ),
			'has'         => __( 'Has', 'content-control' ),
			'hasnot'      => __( 'Has Not', 'content-control' ),
			'doesnothave' => __( 'Does Not Have', 'content-control' ),
			'does'        => __( 'Does', 'content-control' ),
			'doesnot'     => __( 'Does Not', 'content-control' ),
			'was'         => __( 'Was', 'content-control' ),
			'wasnot'      => __( 'Was Not', 'content-control' ),
			'were'        => __( 'Were', 'content-control' ),
			'werenot'     => __( 'Were Not', 'content-control' ),
		];
	}

	/**
	 * Get a list of built in rules.
	 *
	 * @return array
	 */
	private function get_built_in_rules() {
		$verbs = $this->get_verbs();
		return [
			'user_has_role' => [
				'name'     => 'user_has_role',
				'label'    => __( 'Role(s)', 'content-control' ),
				'category' => __( 'User', 'content-control' ),
				'format'   => '{category} {verb} {label}',
				'verbs'    => [ $verbs['has'], $verbs['doesnothave'] ],
				'fields'   => [
					[
						'type'     => 'multicheck',
						'id'       => 'roles',
						'label'    => __( 'Role(s)', 'content-control' ),
						'default'  => [ 'administrator' ],
						'multiple' => true,
						'options'  => wp_roles()->get_names(),
					],
				],
			],
		];
	}

	/**
	 * Get an array of rule default values.
	 *
	 * @return array Array of rule default values.
	 */
	public function get_rule_defaults() {
		$verbs = $this->get_verbs();
		return [
			'name'     => '',
			'label'    => '',
			'category' => '',
			'format'   => '{category} {verb} {label}',
			'verbs'    => null,
			'fields'   => [],
			'callback' => null,
			'frontend' => false,
		];
	}

	/**
	 * Get an array of old rule default values.
	 *
	 * @return array Array of old rule default values.
	 */
	private function get_old_rule_defaults() {
		return [
			'id'       => '',
			'callback' => null,
			'group'    => '',
			'name'     => '',
			'priority' => 10,
			'fields'   => [],
			'advanced' => false,
		];
	}

	/**
	 * Remaps keys & values from an old `condition` into a new `rule`.
	 *
	 * @param array $old_rule Old rule definition.
	 * @return array New rule definition.
	 */
	private function remap_old_rule( $old_rule ) {
		$old_rule = wp_parse_args( $old_rule, $this->get_old_rule_defaults() );

		$new_rule = [
			'format' => '{label}',
		];

		$remaped_keys = [
			'id'       => 'name',
			'name'     => 'label',
			'group'    => 'category',
			'fields'   => 'fields',
			'callback' => 'callback',
			'advanced' => 'frontend',
			'priority' => 'priority',
		];

		foreach ( $remaped_keys as $old_key => $new_key ) {
			if ( isset( $old_rule[ $old_key ] ) ) {
				$new_rule[ $new_key ] = $old_rule[ $old_key ];
				unset( $old_rule[ $old_key ] );
			}
		}

		// Merge any leftover 'unknonw' keys, with new stuff second.
		return array_merge( $old_rule, $new_rule );
	}

	/**
	 * Parse rules that are still registered using the older deprecated methods.
	 *
	 * @param array $old_rules Array of old rules to manipulate.
	 * @return array
	 */
	private function parse_old_rules( $old_rules ) {
		$new_rules = [];

		foreach ( $old_rules as $key => $old_rule ) {
			$new_rules[ $key ] = $this->remap_old_rule( $old_rule );
		}

		return $new_rules;
	}

}
