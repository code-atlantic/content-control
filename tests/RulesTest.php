<?php

class RulesTest extends \WP_UnitTestCase  {
	public function testOldRuleConversion() {

		$rules = new \ContentControl\Rules();

		$old_rule = [
			'id'       => 'user_has_commented',
			'group'    => 'User',
			'name'     => 'Has Commented',
			'fields'   => [
				'morethan' => [
					'label' => 'More Than (optional)',
					'type'  => 'number',
					'std'   => 0,
				],
				'lessthan' => [
					'label' => 'Less Than (optional)',
					'type'  => 'number',
					'std'   => 0,
				],
			],
			'callback' => [ 'ConditionCallbacks', 'user_has_commented' ],
			'priority' => 10,
			'advanced' => false,
		];

		$new_rule = [
			'name'     => 'user_has_commented',
			'label'    => 'Has Commented',
			'category' => 'User',
			'format'   => '{category} {label}',
			'verbs'    => null,
			'fields'   => [
				'morethan' => [
					'label' => 'More Than (optional)',
					'type'  => 'number',
					'std'   => 0,
				],
				'lessthan' => [
					'label' => 'Less Than (optional)',
					'type'  => 'number',
					'std'   => 0,
				],
			],
			'callback' => [ 'ConditionCallbacks', 'user_has_commented' ],
			'frontend' => false,
		];

		$this->assertEqualsCanonicalizing( $rules->remap_old_rule( $old_rule ), $new_rule );
	}
}
