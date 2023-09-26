<?php
/**
 * Restriction function tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\FunctionTests;

use Brain\Monkey\Functions;
use ContentControl\Tests\PluginTestCase;

use function ContentControl\user_meets_requirements;

/**
 * Restriction function tests.
 */
class RestrictionFunctionTests extends PluginTestCase {

	/**
	 * Test user_meets_requirements().
	 *
	 * @covers ::user_meets_requirements
	 * @dataProvider userRequirementsProvider
	 */
	public function test_user_meets_requirements( bool $expectedResult, array $args, array|null $stubs, string $message ) {
		// Matching function defaults.
		$args = array_merge( [
			'status'     => '',
			'roles'      => [],
			'role_match' => 'any',
		], $args );

		$stubs = array_merge( [
			'userIsLoggedIn' => false,
			'userIsExcluded' => false,
			'userCan'        => function ( $role ) {
				return false;
			},
		], $stubs ?? [] );

		// Mocks.
		Functions\expect( 'is_user_logged_in' )->andReturn( $stubs['userIsLoggedIn'] );
		Functions\expect( '\\ContentControl\\user_is_excluded' )->andReturn( $stubs['userIsExcluded'] );
		Functions\expect( 'current_user_can' )->andReturnUsing( $stubs['userCan'] );

		$this->assertSame( $expectedResult, user_meets_requirements( ...array_values( $args ) ), $message );
	}

	/**
	 * Tests user_meets_requirements() args.
	 *
	 * Tests:
	 *
	 * - $user_roles = [ 'subscriber', 'editor' ] === $user_roles = [ 'subscriber' => 'subscriber', 'editor' => 'editor' ] $user_roles = 'subscriber,editor' === $user_roles = 'subscriber, editor'
	 *   - Check $user_roles arg accepts all 4 formats.
	 *
	 * @covers ::user_meets_requirements
	 */
	public function test_user_meets_requirements_args() {

		// Mocks.
		Functions\expect( 'is_user_logged_in' )->andReturn( true );
		Functions\expect( '\\ContentControl\\user_is_excluded' )->andReturn( false );
		Functions\expect( 'current_user_can' )->andReturnUsing( function ( $role ) {
			return 'subscriber' === $role;
		} );

		// Test that passing an different formats of $user_roles returns properly match.
		$variants = [
			'Expected that passing an array of roles returns true.' => [ 'subscriber', 'editor' ],
			'Expected that passing an associative array of roles returns true.' => [
				'subscriber' => 'subscriber',
				'editor'     => 'editor',
			],
			'Expected that passing a comma separated string of roles returns true.' => 'subscriber,editor',
			'Expected that passing a comma separated string of roles with spaces returns true.' => 'subscriber, editor',
		];

		foreach ( $variants as $message => $roles ) {
			$this->assertTrue( user_meets_requirements( 'logged_in', $roles, 'match' ), $message );
			$this->assertFalse( user_meets_requirements( 'logged_in', $roles, 'exclude' ), $message );
		}

		// Test that passing different $role_match values returns properly match.
		$variants = [
			'Expected that passing "any" returns true.'   => [
				'value'    => 'any',
				'expected' => true,
			],
			'Expected that passing "match" returns true.' => [
				'value'    => 'match',
				'expected' => true,
			],
			'Expected that passing "exclude" returns false.' => [
				'value'    => 'exclude',
				'expected' => false,
			],
			'Expected that passing an invalid value returns false.' => [
				'value'    => 'invalid',
				'expected' => false,
			],
		];

		foreach ( $variants as $message => $variant ) {
			$this->assertSame( $variant['expected'], user_meets_requirements( 'logged_in', [ 'subscriber', 'editor' ], $variant['value'] ), $message );
		}
	}

	/**
	 * Data provider for test_user_meets_requirements().
	 *
	 * Tests:
	 *
	 * 1. Empty $user_status should always return false.
	 * 2. $user_status = 'logged_in'
	 * - should return false if user is logged out.
	 * - should return true if user is logged in & user_is_excluded() is true.
	 * - should return true if user is logged in & ( roles are empty || $role_match = 'any' ).
	 * - should return true if user is logged in & $role_match = 'any'.
	 * - should return true if user is logged in & roles match & $role_match = 'match'.
	 * - should return false if user is logged in & roles don't match & $role_match = 'match'.
	 * - should return false if user is logged in & roles match & $role_match = 'exclude'.
	 * - should return true if user is logged in & roles don't match & $role_match = 'exclude'.
	 * 3. $user_status = 'logged_out'
	 * - should return true if user is logged out.
	 * - should return false if user is logged in.
	 *
	 * @covers ::user_meets_requirements
	 *
	 * @return array[]
	 */
	public function userRequirementsProvider() {
		return [
			// [ bool $expectedResult, array $args, array|null $stubs, string $message ]

			// 1. Empty $user_status
			// - should always return false.
			'Empty $user_status should always return false.' => [
				false,
				[ 'status' => '' ],
				[
					'userIsLoggedIn' => false,
				],
				'Expected that an empty user status always returns false.',
			],
			// - should return false even if user is logged in.
			'Empty $user_status should always return false even if user is logged in.' => [
				false,
				[ 'status' => '' ],
				[
					'userIsLoggedIn' => true,
				],
				'Expected that an empty user status always returns false even if user is logged in.',
			],

			// 2. $user_status = 'logged_in'
			// - should return false if user is logged out.
			'Logged out user with status "logged_in" should return false.' => [
				false,
				[ 'status' => 'logged_in' ],
				[
					'userIsLoggedIn' => false,
				],
				'Expected that a logged out user with status "logged_in" returns false.',
			],

			// - should return true if user is logged in & user_is_excluded() is true.
			'Logged in user with status "logged_in" and is excluded should return true.' => [
				true,
				[ 'status' => 'logged_in' ],
				[
					'userIsLoggedIn' => true,
					'userIsExcluded' => true,
				],
				'Expected that a logged in user with status "logged_in" and is excluded returns true.',
			],

			// - should return true if user is logged in & roles are empty.
			'Logged in user with status "logged_in" and empty roles should return true.' => [
				true,
				[ 'status' => 'logged_in' ],
				[
					'userIsLoggedIn' => true,
				],
				'Expected that a logged in user with status "logged_in" and empty roles returns true.',
			],

			// - should return true if user is logged in & $role_match = 'any'.
			'Logged in user with status "logged_in" and $role_match = "any" should return true.' => [
				true,
				[
					'status'     => 'logged_in',
					'role_match' => 'any',
				],
				[
					'userIsLoggedIn' => true,
				],
				'Expected that a logged in user with status "logged_in" and $role_match = "any" returns true.',
			],

			// - should return true if user is logged in & roles match & $role_match = 'match'.
			'Logged in user with status "logged_in" and roles match and $role_match = "match" should return true. (1)' => [
				true,
				[
					'status'     => 'logged_in',
					'roles'      => [ 'subscriber', 'editor' ],
					'role_match' => 'match',
				],
				[
					'userIsLoggedIn' => true,
					// Mock a subscirber.
					'userCan'        => function ( $role ) {
						return 'subscriber' === $role;
					},
				],
				'Expected that a logged in user with status "logged_in" and roles match and $role_match = "match" returns true.',
			],

			// - second check for roles match with not first role.
			'Logged in user with status "logged_in" and roles match and $role_match = "match" should return true. (2)' => [
				true,
				[
					'status'     => 'logged_in',
					'roles'      => [ 'subscriber', 'editor' ],
					'role_match' => 'match',
				],
				[
					'userIsLoggedIn' => true,
					// Mock an editor.
					'userCan'        => function ( $role ) {
						return 'editor' === $role;
					},
				],
				'Expected that a logged in user with status "logged_in" and roles match and $role_match = "match" returns true.',
			],

			// - should return false if user is logged in & roles don't match & $role_match = 'match'.
			'Logged in user with status "logged_in" and roles don\'t match and $role_match = "match" should return false.' => [
				false,
				[
					'status'     => 'logged_in',
					'roles'      => [ 'administrator', 'editor' ],
					'role_match' => 'match',
				],
				[
					'userIsLoggedIn' => true,
					// Mock a user without access.
					'userCan'        => function ( $role ) {
						// Check for roles we aren't passing.
						return 'subscriber' === $role;
					},
				],
				'Expected that a logged in user with status "logged_in" and roles don\'t match and $role_match = "match" returns false.',
			],

			// - should return false if user is logged in & roles match & $role_match = 'exclude'.
			'Logged in user with status "logged_in" and roles match and $role_match = "exclude" should return false.' => [
				false,
				[
					'status'     => 'logged_in',
					'roles'      => [ 'subscriber', 'editor' ],
					'role_match' => 'exclude',
				],
				[
					'userIsLoggedIn' => true,
					// Mock a subscirber.
					'userCan'        => function ( $role ) {
						return 'subscriber' === $role;
					},
				],
				'Expected that a logged in user with status "logged_in" and roles match and $role_match = "exclude" returns false.',
			],

			// - should return true if user is logged in & roles don't match & $role_match = 'exclude'.
			'Logged in user with status "logged_in" and roles don\'t match and $role_match = "exclude" should return true.' => [
				true,
				[
					'status'     => 'logged_in',
					'roles'      => [ 'administrator', 'editor' ],
					'role_match' => 'exclude',
				],
				[
					'userIsLoggedIn' => true,
					// Mock a user without access.
					'userCan'        => function ( $role ) {
						// Check for roles we aren't passing.
						return 'subscriber' === $role;
					},
				],
				'Expected that a logged in user with status "logged_in" and roles don\'t match and $role_match = "exclude" returns true.',
			],

			// 3. $user_status = 'logged_out'
			// - should return true if user is logged out.
			'Logged out user with status "logged_out" should return true.' => [
				true,
				[ 'status' => 'logged_out' ],
				[
					'userIsLoggedIn' => false,
				],
				'Expected that a logged out user with status "logged_out" returns true.',
			],

			// - should return false if user is logged in.
			'Logged in user with status "logged_out" should return false.' => [
				false,
				[ 'status' => 'logged_out' ],
				[
					'userIsLoggedIn' => true,
				],
				'Expected that a logged in user with status "logged_out" returns false.',
			],
		];
	}
}
