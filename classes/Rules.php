<?php

namespace ContentControl;

use function \__;

class Rules {

	public $data;

	public function __construct() {
		$this->init();
	}

	public function init() {
		$rules = $this->get_built_in_rules();

		$old_rules = apply_filters( 'jp_cc_registered_conditions',  );
	}

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
	public function get_built_in_rules() {
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

	public function old_rule_defaults() {
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

	public function rule_defaults() {
		$verbs = $this->verbs();
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
	 * Remaps keys & values from an old `condition` into a new `rule`.
	 *
	 * @param array $old_rule Old rule definition.
	 * @return array New rule definition.
	 */
	public function remap_old_rule( $old_rule ) {
		$new_rule = [
			'format' => '{category} {label}',
		];

		$remaped_keys = [
			'id'       => 'name',
			'name'     => 'label',
			'group'    => 'category',
			'fields'   => 'fields',
			'callback' => 'callback',
			'advanced' => 'frontend',
		];

		foreach ( $remaped_keys as $old_key => $new_key ) {
			if ( isset( $old_rule[ $old_key ] ) ) {
				$new_rule[ $new_key ] = $old_rule[ $old_key ];
			}
		}

		return $new_rule;
	}

	public function registerRule( $rule ) {
		if ( $this->isValidRule( $rule ) ) {
			$rule = wp_parse_args( $rule, $this->rule_defaults() );

			$this->data[ $rule['name'] ] = $rule;
		}
	}

	public function isValidRule( $rule ) {
		return true;
	}

	public function getRules() {
		return $this->data;
	}

	public function parseOldRules( $old_rules ) {
		$new_rules = [];

		return $new_rules;
	}

	public function get_block_editor_rules() {
		return [];
	}

}
