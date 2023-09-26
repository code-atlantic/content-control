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

	public function test_user_meets_requirements() {

		/**
		 * Mock List
		 *
		 * 1. is_user_logged_in
		 * 2. current_user_can
		 * 3. user_is_excluded
		 */

		/**
		 * Tests
		 *
		 * 1. Empty $user_status should always return false.
		 * 2. $user_status = 'logged_in'
		 * - should return false if user is logged out.
		 * - should return true if user is logged in & user_is_excluded() is true.
		 * - should return true if user is logged in & ( roles are empty || $role_match = 'any' ).
		 * - should return true if user is logged in & roles match & $role_match = 'match'.
		 * - should return false if user is logged in & roles don't match & $role_match = 'match'.
		 * - should return false if user is logged in & roles match & $role_match = 'exclude'.
		 * - should return true if user is logged in & roles don't match & $role_match = 'exclude'.
		 * 3. $user_status = 'logged_out'
		 * - should return true if user is logged out.
		 * - should return false if user is logged in.
		 */

		// 1. Empty $user_status should always return false.
		$this->assertFalse( user_meets_requirements( '' ), 'Expected that an empty user status always returns false.' );

		// 2. $user_status = 'logged_in'
		// - should return false if user is logged out.
		Functions\expect( 'is_user_logged_in' )->andReturn( false );
		$this->assertFalse( user_meets_requirements( 'logged_in' ), "Expected that a logged out user with status 'logged_in' returns false." );

		// - should return true if user is logged in & user_is_excluded() is true.
		Functions\expect( 'is_user_logged_in' )->andReturn( true );
		Functions\expect( '\\ContentControl\\user_is_excluded' )->andReturn( true );
		$this->assertTrue( user_meets_requirements( 'logged_in' ), "Expected that a logged in user with status 'logged_in' and is excluded returns true." );
	}
}
