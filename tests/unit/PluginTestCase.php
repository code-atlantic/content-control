<?php
/**
 * PHPUnit TestCase class.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests;

use Mockery;
use Brain\Monkey;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

/**
 * TestCase base class.
 */
abstract class PluginTestCase extends TestCase {

	// Adds Mockery expectations to the PHPUnit assertions count.
	use MockeryPHPUnitIntegration;

	/**
	 * Runs before each test.
	 */
	protected function setUp(): void {
		parent::setUp();
		Monkey\setUp();
		require_once __DIR__ . '/../../inc/functions.php';
	}

	/**
	 * Runs after each test.
	 */
	protected function tearDown(): void {
		Monkey\tearDown();
		parent::tearDown();
	}

	/**
	 * Mock the plugin instance.
	 */
	protected function createPluginMock( $getters = null ) {
		static $plugin;

		if ( ! isset( $plugin ) ) {
			$plugin = Mockery::mock( '\ContentControl\Plugin' );

			$plugin->shouldReceive( 'get' )
			->withNoArgs()
			->andReturn( $plugin );
		}

		if ( isset( $getters ) ) {
			foreach ( $getters as $key => $value ) {
				$plugin->shouldReceive( 'get' )
					->with( $key )
					->andReturn( $value );
			}
		}

		Monkey\Functions\when( '\ContentControl\plugin' )
			->alias(function ( $key = null ) use ( $plugin ) {
				if ( null === $key ) {
					return $plugin;
				}
				return $plugin->get( $key );
			});

		return $plugin;
	}

	/**
	 * Mock the plugin Rules instance.
	 *
	 * @return \Mockery\MockInterface|\Mockery\LegacyMockInterface
	 */
	protected function createRulesMock() {
		$plugin = $this->createPluginMock();

		$rulesMock = Mockery::mock( 'overload:\ContentControl\RuleEngine\Rules' );

		$plugin->shouldReceive( 'get' )
			->with( 'rules' )
			->andReturn( $rulesMock );

		return $rulesMock;
	}

	/**
	 * Mock the plugin Rule model instance.
	 *
	 * @param array<string,mixed> $args Rule arguments.
	 * @return \Mockery\MockInterface|\Mockery\LegacyMockInterface
	 */
	public function createRuleMock( $args ) {
		$args = array_merge(
			[
				'id'            => '',
				'name'          => '',
				'notOperand'    => false,
				'options'       => [],
				'extras'        => [],
				'frontend_only' => false,
			],
			$args
		);

		$rule = Mockery::mock( 'overload:\ContentControl\RuleEngine\Rule' );
		$rule->shouldReceive( 'id' )->andReturn( $args['id'] );
		$rule->shouldReceive( 'name' )->andReturn( $args['name'] );
		$rule->shouldReceive( 'not_operand' )->andReturn( $args['notOperand'] );
		$rule->shouldReceive( 'frontend_only' )->andReturn( $args['frontend_only'] );
		$rule->shouldReceive( 'options' )->andReturn( $args['options'] );
		$rule->shouldReceive( 'extras' )->andReturn( $args['extras'] );

		return $rule;
	}

	/**
	 * Mock the plugin.
	 *
	 * @return \Mockery\MockInterface|\Mockery\LegacyMockInterface
	 */
	protected function mockPlugin( array $should_receive = null ) {
		// Mock plugin instance with restrictions::get_restriction().
		$plugin = Mockery::mock( 'overload:\ContentControl\Plugin' );

		// Foreach $should_recieve => $return, mock the method to get( $key ) : $return.
		if ( isset( $should_receive ) ) {
			foreach ( $should_receive as $key => $return ) {
				$plugin->shouldReceive( 'get' )
					->with( $key )
					->andReturn( $return );
			}
		}

		// Mock plugin() to return our mock plugin instance.
		Monkey\Functions\when( '\ContentControl\plugin' )
			->justReturn( function ( $service_or_config ) use ( $plugin ) {
				if ( ! isset( $service_or_config ) ) {
					return $plugin;
				}

				return $plugin->get( $service_or_config );
			} );

		return $plugin;
	}
}
