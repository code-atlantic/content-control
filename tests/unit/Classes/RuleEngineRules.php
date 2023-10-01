<?php
/**
 * Restriction function tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Classes;

use Mockery;
use Brain\Monkey\Actions;
use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use ContentControl\RuleEngine\Rules;
use ContentControl\Tests\PluginTestCase;

/**
 * Rule function tests.
 *
 * @see inc/functions/mockRules$mockRules.php
 */
class RuleEngineRules extends PluginTestCase {

	public function createMockRules( $bypass_init = false ) {
		$mockRules = Mockery::mock( '\ContentControl\RuleEngine\Rules' )
			->makePartial();

		// If not required, we should still mock it to ensure it's not called, but it might get called
		// by accident.
		if ( $bypass_init ) {
			// Ensure that if init is called, its internally bypassed.
			do_action( 'content_control/rule_engine/register_rules' );
		}

		return $mockRules;
	}

	public function createMockRulesWithoutInit() {
		return $this->createMockRules( true );
	}

	/**
	 * Test current_rule method.
	 *
	 * @covers \ContentControl\RuleEngine\Rules::current_rule
	 *
	 * Tests:
	 *
	 * 1. current_rule() returns null if no rule is set
	 * 2. setting rule returns the rule
	 * 3. getting set rule returns the rule
	 * 4. changing rule returns the new rule
	 * 5. getting rule returns the new rule
	 * 6. setting to null returns null
	 * 7. getting rule returns null
	 *
	 * @return void
	 */
	public function test_current_rule_method() {
		$mockRules = $this->createMockRulesWithoutInit(); // Doesn't call init.
		$mockRule1 = Mockery::mock( '\ContentControl\Models\RuleEngine\Rule' );
		$mockRule2 = Mockery::mock( '\ContentControl\Models\RuleEngine\Rule' );

		// Assume current_rule is null initially.
		$this->assertNull( $mockRules->current_rule() );

		// 1. current_rule() returns null if no rule is set.
		$this->assertNull( $mockRules->current_rule() );

		// 2. setting rule returns the rule.
		$this->assertSame( $mockRule1, $mockRules->current_rule( $mockRule1 ) );

		// 3. getting set rule returns the rule.
		$this->assertSame( $mockRule1, $mockRules->current_rule() );

		// 4. changing rule returns the new rule.
		$this->assertSame( $mockRule2, $mockRules->current_rule( $mockRule2 ) );

		// 5. getting rule returns the new rule.
		$this->assertSame( $mockRule2, $mockRules->current_rule() );

		// 6. setting to null returns null.
		$this->assertNull( $mockRules->current_rule( null ) );

		// 7. getting rule returns null.
		$this->assertNull( $mockRules->current_rule() );
	}

	/**
	 * Test register_rule method.
	 *
	 * @covers \ContentControl\RuleEngine\Rules::register_rule
	 *
	 * Tests:
	 *
	 * 1. registered rules are stored in the mockRules$mockRules object.
	 * 2. invalid rules are not registered.
	 * 3. duplicate rules are registered with a suffix.
	 *
	 * @return void
	 */
	public function test_register_rule_method() {
		$mockRules = $this->createMockRulesWithoutInit();

		// Mocking WordPress function.
		Functions\stubTranslationFunctions();
		Functions\stubs([
			'wp_parse_args' => null,
		]);

		$ruleData = [
			'name' => 'test_rule',
		];

		// Assuming that "is_rule_valid" always returns true for simplicity.
		$mockRules->register_rule( $ruleData );
		$mockRules->register_rule( $ruleData );

		// Test passing invalid rule.
		$mockRules->register_rule( [] );

		// Checking if the rule was registered.
		$registeredRules = $mockRules->get_rules();

		$this->assertArrayHasKey( 'test_rule', $registeredRules );
		$this->assertSame( 2, count( $mockRules->get_rules() ) );
		$this->assertSame( $ruleData, $registeredRules['test_rule'] );
		$this->assertSame( $ruleData, $registeredRules['test_rule-1'] );
	}

	/**
	 * Test is_rule_valid method.
	 *
	 * @covers \ContentControl\RuleEngine\Rules::is_rule_valid
	 *
	 * Tests:
	 *
	 * 1. is_rule_valid returns false for invalid rules.
	 * 2. is_rule_valid returns true for valid rules.
	 */
	public function test_is_rule_valid_method() {
		$mockRules = $this->createMockRules();

		// Invalid mockRules$mockRules should return false.
		$this->assertFalse( $mockRules->is_rule_valid( 'invalid_rule' ) );

		// Valid mockRules$mockRules should return true.
		$this->assertTrue( $mockRules->is_rule_valid( [
			'name' => 'test_rule',
		] ) );
	}

	public function test_get_rules_method() {
		Functions\stubs( [
			'wp_parse_args' => null,
		]);
		Functions\stubTranslationFunctions();

		// Ensure the register_rules action is called.
		Actions\expectDone( 'content_control/rule_engine/register_rules' );

		$mockRules = $this->createMockRulesWithoutInit();

		// Register test rule.
		$rule = [
			'name' => 'test_rule',
		];

		// Register test rule.
		$mockRules->register_rule( $rule );

		// Ensure the mockRules$mockRules match expected.
		$this->assertSame( [ $rule['name'] => $rule ], $mockRules->get_rules() );
	}

	public function test_get_rule_method() {
		Functions\stubs( [
			'wp_parse_args' => null,
			'__'            => null,
		]);

		$mockRules = $this->createMockRulesWithoutInit();

		// Register test rule.
		$rule = [
			'name' => 'test_rule',
		];

		$mockRules->register_rule( $rule );

		// Ensure the mockRules$mockRules match expected.
		$this->assertSame( $rule, $mockRules->get_rule( 'test_rule' ) );
	}

	public function test_get_block_editor_rules_method() {
		Functions\stubs( [ 'wp_parse_args' ] );
		Functions\stubTranslationFunctions();

		$mockRules = $this->createMockRulesWithoutInit();

		// Register test rule.
		$rule = [
			'name' => 'test_rule',
		];

		$mockRules->register_rule( $rule );

		Filters\expectApplied( 'content_control/rule_engine/get_block_editor_rules' )
			->twice()
			->andReturn( [ $rule['name'] => $rule ], [] );

		// Ensure the mockRules$mockRules match expected.
		$this->assertSame( [ $rule['name'] => $rule ], $mockRules->get_block_editor_rules() );

		// Ensure the mockRules$mockRules match expected.
		$this->assertSame( [], $mockRules->get_block_editor_rules() );
	}

	public function test_get_verbs_method() {
		Functions\stubTranslationFunctions();

		$mockRules = new Rules();

		$verbs = $mockRules->get_verbs();

		$this->assertIsArray( $verbs );
		$this->assertNotEmpty( $verbs );

		$this->assertArrayHasKey( 'is', $verbs );
		$this->assertIsString( $verbs['is'] );
		$this->assertNotEmpty( $verbs['is'] );

		// Sample a few known verbs.
		$this->assertArrayHasKey( 'isnot', $verbs );
		$this->assertArrayHasKey( 'has', $verbs );
		$this->assertArrayHasKey( 'arenot', $verbs );
	}

	/**
	 * Test init method.
	 *
	 * @covers \ContentControl\RuleEngine\Rules::init
	 * @covers \ContentControl\RuleEngine\Rules::register_built_in_rules
	 * @covers \ContentControl\RuleEngine\Rules::register_deprecated_rules
	 *
	 * Tests:
	 *
	 * 1. init() registers built-in mockRules$mockRules only once.
	 * 2. init calls register_built_in_rules().
	 * 3. content_control/rule_engine/mockRules$mockRules filter applied, with $mockRules.
	 * 4. content_control/rule_engine/mockRules$mockRules filter applied only  once.
	 * 5. register_rule called for each rule.
	 * 6. content_control/rule_engine/register_rules action called once with $mockRules.
	 * 7. init calls register_deprecated_rules().
	 * 8. content_control/rule_engine/deprecated_rules filter applied, with $deprecated_rules.
	 * 9. content_control/rule_engine/deprecated_rules filter applied only once.
	 * 10. parse_old_rules called only once with $deprecated_rules.
	 * 11. register_rule called for each rule.
	 * 12. get_rules doesn't call init again.
	 * 13. get_rules returns the expected mockRules$mockRules (built-in + deprecated).
	 */
	public function test_init_method() {
		Functions\stubs( [ 'wp_parse_args' ] );
		Functions\stubTranslationFunctions();

		/**
		 * Mocking the mockRules$mockRules class to allow testing protected methods.
		 *
		 * @var \ContentControl\RuleEngine\Rules&\Mockery\ExpectationInterface
		 */
		$mockRules = $this->createMockRules( true )
			->shouldAllowMockingProtectedMethods();

		$rules_by_type = [
			'user'            => [ 'user' => [ 'name' => 'user' ] ],
			'general_content' => [ 'home' => [ 'name' => 'home' ] ],
			'post_type'       => [ 'post' => [ 'name' => 'post' ] ],
			'taxonomy'        => [ 'category' => [ 'name' => 'category' ] ],
		];

		$deprecated_rules = [
			'oldfield' => [ 'id' => 'oldfield' ],
		];

		$deprecated_rules_after_trasnform = [
			'oldfield' => [
				'format'     => '{label}',
				'name'       => 'oldfield',
				'deprecated' => true,
			],
		];

		$build_in_rules = array_merge( ...array_values( $rules_by_type ) );
		$all_rules      = array_merge( $build_in_rules, $deprecated_rules_after_trasnform );

		$mockRules
			// 1. init() registers built-in mockRules$mockRules only once.
			->shouldReceive( 'init' )
				->passthru()
				->once()

			// 2. init calls register_built_in_rules().
			->shouldReceive( 'register_built_in_rules' )
				->passthru()
				->once()

			// - register_rule calls get_user_rules once.
			->shouldReceive( 'get_user_rules' )
				->withNoArgs()
				->once()
				->andReturn( $rules_by_type['user'] )

			// - register_rule calls get_general_content_rules once.
			->shouldReceive( 'get_general_content_rules' )
				->withNoArgs()
				->once()
				->andReturn( $rules_by_type['general_content'] )

			// - register_rule calls get_post_type_rules once.
			->shouldReceive( 'get_post_type_rules' )
				->withNoArgs()
				->once()
				->andReturn( $rules_by_type['post_type'] )

			// - register_rule calls get_taxnomy_rules once.
			->shouldReceive( 'get_taxonomy_rules' )
				->withNoArgs()
				->once()
				->andReturn( $rules_by_type['taxonomy'] )

			// 5. register_rule called for each rule.
			->shouldReceive( 'register_rule' )
				->times( count( $all_rules ) )
				->passthru()

			// 7. init calls register_deprecated_rules().
			->shouldReceive( 'register_deprecated_rules' )
				->once()
				->passthru()

			// 10. parse_old_rules called only once with $deprecated_rules.
			->shouldReceive( 'parse_old_rules' )
				->once()
				->passthru();

		// 3. content_control/rule_engine/rules filter applied, with $mockRules.
		Filters\expectApplied( 'content_control/rule_engine/rules' )
		// 4. content_control/rule_engine/mockRules filter applied only  once.
		->once()
		->with( $build_in_rules );

		// 6. content_control/rule_engine/register_rules action called once with $mockRules.
		Actions\expectDone( 'content_control/rule_engine/register_rules' )
			->once()
			->with( $mockRules );

		// 8. content_control/rule_engine/deprecated_rules filter applied, with $deprecated_rules.
		Filters\expectApplied( 'content_control/rule_engine/deprecated_rules' )
			// 9. content_control/rule_engine/deprecated_rules filter applied only once.
			->once()
			->andReturn( $deprecated_rules );

		// Run init.
		$mockRules->init();

		// 12. get_rules returns the expected mockRules$mockRules (built-in + deprecated).
		// 13. get_rules doesn't call init again.
		$this->assertSame( $all_rules, $mockRules->get_rules() );

		$this->assertSame( $all_rules['oldfield'], $mockRules->get_rule( 'oldfield' ) );
	}

	public function tetest_get_post_type_rules_method() {
		Functions\stubs( [ 'wp_parse_args' ] );
		Functions\stubTranslationFunctions();

		$mockRules = $this->createMockRules();

		// Register test rule.
		$rule = [
			'name' => 'test_rule',
		];

		$mockRules->register_rule( $rule );

		Filters\expectApplied( 'content_control/rule_engine/get_post_type_rules' )
			->twice()
			->andReturn( [ $rule['name'] => $rule ], [] );

		// Ensure the mockRules$mockRules match expected.
		$this->assertSame( [ $rule['name'] => $rule ], $mockRules->get_post_type_rules() );

		// Ensure the mockRules$mockRules match expected.
		$this->assertSame( [], $mockRules->get_post_type_rules() );
	}
}
