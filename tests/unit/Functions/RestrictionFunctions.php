<?php
/**
 * Restriction function tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Functions;

use Mockery;
use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use ContentControl\Tests\PluginTestCase;


use function ContentControl\get_restriction;
use function ContentControl\user_is_excluded;
use function ContentControl\admins_are_excluded;
use function ContentControl\query_can_be_ignored;
use function ContentControl\user_meets_requirements;

/**
 * Restrictions function tests.
 *
 * @see inc/functions/restrictions.php
 */
class RestrictionFunctions extends PluginTestCase {

	/**
	 * Test get_restriction().
	 *
	 * @mock \ContentControl\Plugin
	 * @mock \ContentControl\Plugin::get_restriction
	 * @mock \wp_parse_args
	 *
	 * @covers \ContentControl\get_restriction
	 */
	public function test_get_restriction() {
		// Mock Restriction with id & slug.
		$mock_restriction       = Mockery::mock( '\ContentControl\Models\Restriction' );
		$mock_restriction->id   = 1;
		$mock_restriction->slug = 'my-restriction';

		// Mock plugin instance with restrictions::get_restriction().
		$plugin = Mockery::mock( '\ContentControl\Plugin' );
		$plugin->shouldReceive( 'get_restriction' )->andReturnUsing( function ( $restriction ) use ( $mock_restriction ) {
			if ( 1 === $restriction ) {
				return $mock_restriction;
			} elseif ( 'my-restriction' === $restriction ) {
				return $mock_restriction;
			} elseif ( $restriction instanceof \ContentControl\Models\Restriction ) {
				return $restriction;
			}

			return null;
		} );

		// Mock plugin() to return our mock plugin instance.
		Functions\when( 'ContentControl\plugin' )->justReturn( $plugin );
		// Mock wp_parse_args() to return passed args.
		Functions\when( 'wp_parse_args' )->justReturn();

		// Test with ID.
		$restriction = get_restriction( 1 );
		$this->assertInstanceOf( '\ContentControl\Models\Restriction', $restriction );
		$this->assertSame( 1, $restriction->id );
		$this->assertSame( 'my-restriction', $restriction->slug );

		// Test with slug.
		$restriction = get_restriction( 'my-restriction' );
		$this->assertInstanceOf( '\ContentControl\Models\Restriction', $restriction );
		$this->assertSame( 1, $restriction->id );
		$this->assertSame( 'my-restriction', $restriction->slug );

		$mock_restriction2       = Mockery::mock( '\ContentControl\Models\Restriction' );
		$mock_restriction2->id   = 2;
		$mock_restriction2->slug = 'my-restriction-2';

		// Test with object.
		$restriction = get_restriction( $mock_restriction2 );
		$this->assertInstanceOf( '\ContentControl\Models\Restriction', $restriction );
		$this->assertSame( 2, $restriction->id );
		$this->assertSame( 'my-restriction-2', $restriction->slug );

		// Test with invalid restriction.
		$restriction = get_restriction( 'invalid-restriction' );
		$this->assertNull( $restriction );

		// Test with invalid restriction.
		$restriction = get_restriction( 2 );
		$this->assertNull( $restriction );
	}

	/**
	 * Test admins_are_excluded().
	 *
	 * @mock \ContentControl\Plugin
	 * @mock \ContentControl\Plugin::get_option
	 * @mock \ContentControl\get_data_version
	 *
	 * @covers \ContentControl\admins_are_excluded
	 */
	public function test_admins_are_excluded() {
		// Mock get_data_version() to return 2.
		Functions\when( 'ContentControl\\get_data_version' )->justReturn( 2 );

		// Mock plugin instance with get_option() to return true.
		$plugin = Mockery::mock( '\ContentControl\Plugin' );
		$plugin->shouldReceive( 'get_option' )->andReturn( true );
		Functions\when( 'ContentControl\\plugin' )->justReturn( $plugin );

		// Test with excludeAdmins option enabled.
		$this->assertTrue( admins_are_excluded() );

		$plugin = Mockery::mock( '\ContentControl\Plugin' );
		$plugin->shouldReceive( 'get_option' )->andReturn( false );
		Functions\when( 'ContentControl\\plugin' )->justReturn( $plugin );

		// Test with excludeAdmins option disabled.
		$this->assertFalse( admins_are_excluded() );
	}

	/**
	 * Test user_is_excluded().
	 *
	 * @mock \ContentControl\admins_are_excluded
	 * @mock \ContentControl\Plugin
	 * @mock \ContentControl\Plugin::get_permission
	 * @mock \current_user_can
	 *
	 * @covers \ContentControl\user_is_excluded
	 */
	public function test_user_is_excluded() {
		$matrix = [
			// Expected Result, admins_are_excluded, current_user_can.
			[ true, true, true ],
			[ false, true, false ],
			[ false, false, true ],
			[ false, false, false ],
		];

		foreach ( $matrix as $test ) {
			$expected_result     = $test[0];
			$admins_are_excluded = $test[1];
			$current_user_can    = $test[2];

			// Mock admins_are_excluded() to return $admins_are_excluded.
			Functions\when( 'ContentControl\\admins_are_excluded' )->justReturn( $admins_are_excluded );

			// Mock plugin instance with get_permission() to return 'manage_settings'.
			$plugin = Mockery::mock( '\ContentControl\Plugin' );
			$plugin->shouldReceive( 'get_permission' )->andReturn( 'manage_settings' );
			Functions\when( 'ContentControl\\plugin' )->justReturn( $plugin );

			// Mock current_user_can() to return $current_user_can.
			Functions\when( 'current_user_can' )->justReturn( $current_user_can );

			// Test with excludeAdmins option enabled and user with manage_settings capability.
			$this->assertSame( $expected_result, user_is_excluded() );
		}
	}

	/**
	 * Tests user_meets_requirements() args.
	 *
	 * Tests:
	 *
	 * - $user_roles = [ 'subscriber', 'editor' ] === $user_roles = [ 'subscriber' => 'subscriber', 'editor' => 'editor' ] $user_roles = 'subscriber,editor' === $user_roles = 'subscriber, editor'
	 *   - Check $user_roles arg accepts all 4 formats.
	 *
	 * @covers \ContentControl\user_meets_requirements
	 */
	public function test_user_meets_requirements_args() {

		// Mocks.
		Functions\expect( 'is_user_logged_in' )->andReturn( true );
		Functions\expect( '\\ContentControl\\user_is_excluded' )->andReturn( false );
		Functions\expect( 'current_user_can' )->andReturnUsing( function ( $role ) {
			return 'subscriber' === $role;
		} );

		$this->assertFalse( user_meets_requirements( 'invalid' ), 'Expected that an invalid user status returns false.' );

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
	 * Test user_meets_requirements().
	 *
	 * @covers \ContentControl\user_meets_requirements
	 * @dataProvider userMeetsRequirementsProvider
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
	 * @covers \ContentControl\user_meets_requirements
	 *
	 * @return array[]
	 */
	public function userMeetsRequirementsProvider() {
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

	/**
	 * Test query_can_be_ignored().
	 *
	 * @mock \WP_Query
	 * @mock \WP_Query::get( 'ignore_restrictions' | 'post_type' )
	 *
	 * @covers \ContentControl\query_can_be_ignored
	 */
	public function test_query_can_be_ignored() {
		$matrix = [
			// expected, ignore_restrictions, post_type.
			'Expected that a query with ignore_restrictions = true returns true.' =>
				[ true, true, 'post' ],
			// Test with ignored post_type.
			"Expected that a query with ignore_restrictions = false and post_type = 'cc_restriction' returns true." =>
				[ true, false, 'cc_restriction' ],
			// Test with valid post_types.
			"Expected that a query with ignore_restrictions = false and post_type = 'post' returns false." =>
				[ false, false, 'post' ],
			"Expected that a query with ignore_restrictions = false and post_type = 'page' returns false." =>
				[ false, false, 'page' ],
		];

		foreach ( $matrix as $message => $test ) {
			$expected_result     = $test[0];
			$ignore_restrictions = $test[1];
			$post_type           = $test[2];

			// Mocks.
			$query = Mockery::mock( '\WP_Query' );
			$query->shouldReceive( 'get' )->andReturnUsing( function ( $arg ) use ( $ignore_restrictions, $post_type ) {
				if ( 'ignore_restrictions' === $arg ) {
					return $ignore_restrictions;
				} elseif ( 'post_type' === $arg ) {
					return $post_type;
				}

				return '';
			} );

			$this->assertSame( $expected_result, query_can_be_ignored( $query ), $message );
		}
	}

	/**
	 * Data provider for test_query_can_be_ignored().
	 *
	 * Tests:
	 *
	 * 1. $query->get( 'ignore_restrictions', false ) === true
	 * - should return true.
	 * 2. $query->get( 'ignore_restrictions', false ) === false
	 * - should return false.
	 *
	 * @covers \ContentControl\query_can_be_ignored
	 *
	 * @return array[]
	 */
	public function queryCanBeIgnoredProvider() {
		return [
			// [ bool $expectedResult, array $args, array|null $stubs, string $message ]

			// 1. $query->get( 'ignore_restrictions', false ) === true
			// - should return true.
			'Query with ignore_restrictions = true should return true.' => [
				true,
				[ 'ignore_restrictions' => true ],
				[
					'queryGet' => true,
				],
				'Expected that a query with ignore_restrictions = true returns true.',
			],

			// 2. $query->get( 'ignore_restrictions', false ) === false
			// - should return false.
			'Query with ignore_restrictions = false should return false.' => [
				false,
				[ 'ignore_restrictions' => false ],
				[
					'queryGet' => false,
				],
				'Expected that a query with ignore_restrictions = false returns false.',
			],
		];
	}

	/**
	 * Test query_can_be_ignored() filters.
	 *
	 * @dataProvider queryCanBeIgnoredProviderFilterProvider
	 *
	 * @covers \ContentControl\query_can_be_ignored
	 */
	public function test_query_can_be_ignored_filters( bool $expected, array $args, string $message ) {
		// Reset mocks.
		$query = Mockery::mock( '\WP_Query' );
		$query->shouldReceive( 'get' )->andReturnUsing( function ( $arg ) {
			if ( 'ignore_restrictions' === $arg ) {
				return false;
			} elseif ( 'post_type' === $arg ) {
				return 'post';
			}
		} );

		$args = array_merge(
			[
				'filter_name' => null,
				'return_val'  => null, // null === passthrough.
			],
			$args
		);

		Filters\expectApplied( 'content_control/' . $args['filter_name'] )
			->andReturn( $args['return_val'] );

		$this->assertSame( $expected, query_can_be_ignored( $query ), $message );
	}

	/**
	 * Data provider for test_query_can_be_ignored_filters().
	 *
	 * Setup:
	 * - $query->get( 'ignore_restrictions', false ) === false
	 * - $query->get( 'post_type', 'post' ) === 'post'
	 *
	 * Tests:
	 *
	 * 1. content_control/post_types_to_ignore
	 * - if filter appends 'post', should return true.
	 * - if filter appends 'page', should return false.
	 * 2. content_control/ignoreable_query
	 * - if filter returns true, should return true.
	 * - if filter returns false, should return false.
	 */
	public function queryCanBeIgnoredProviderFilterProvider() {
		return [
			// [ bool $expectedResult, array $args, string $message ]

			// 1. content_control/post_types_to_ignore
			// - if filter appends 'post', should return true.
			'Query with post_type = "post" and post_types_to_ignore includes "post" should return true.' => [
				true,
				[
					'filter_name' => 'post_types_to_ignore',
					'return_val'  => [ 'post' ],
				],
				'Expected that a query with post_type = "post" and post_types_to_ignore includes "post" returns true.',
			],

			// // - if filter appends 'page', should return false.
			'Query with post_type = "post" and post_types_to_ignore includes "page" should return false.' => [
				false,
				[
					'filter_name' => 'post_types_to_ignore',
					'return_val'  => [ 'page' ],
				],
				'Expected that a query with post_type = "post" and post_types_to_ignore includes "page" returns false.',
			],

			// // 2. content_control/ignoreable_query
			// - if filter returns true, should return true.
			'If the ignoreable_query filter returns anthing other than false, should return true.' => [
				true,
				[
					'filter_name' => 'ignoreable_query',
					'return_val'  => true,
				],
				'Expected that a query with post_type = "post" and ignoreable_query filter returns true returns true.',
			],

			// - if filter returns false, should return false.
			'If the ignoreable_query filter returns false should return false.' => [
				false,
				[
					'filter_name' => 'ignoreable_query',
					'return_val'  => false,
				],
				'Expected that a query with post_type = "post" and ignoreable_query filter returns false returns false.',
			],

		];
	}
}
