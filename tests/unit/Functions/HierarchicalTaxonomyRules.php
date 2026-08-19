<?php
/**
 * Hierarchical taxonomy rule tests.
 *
 * @package ContentControl\Tests
 */

namespace ContentControl\Tests\Functions;

use Brain\Monkey\Functions;
use ContentControl\RuleEngine\Rules;
use ContentControl\Tests\PluginTestCase;
use Mockery;
use ReflectionMethod;

use function ContentControl\Rules\content_is_ancestor_of_term;
use function ContentControl\Rules\content_is_child_of_term;
use function ContentControl\Rules\get_current_taxonomy_term;

/**
 * Verifies hierarchical taxonomy rule registration and matching.
 */
class HierarchicalTaxonomyRules extends PluginTestCase {

	/**
	 * Hierarchy rules are registered only for hierarchical taxonomies.
	 *
	 * @return void
	 */
	public function test_registers_rules_only_for_hierarchical_taxonomies() {
		$plugin = Mockery::mock();
		$plugin->shouldReceive( 'get_option' )
			->once()
			->with( 'includePrivateTaxonomies', false )
			->andReturn( false );

		Functions\when( '\ContentControl\plugin' )->justReturn( $plugin );
		Functions\when( 'get_taxonomies' )->justReturn( [
			'category' => (object) [
				'hierarchical' => true,
				'labels'       => (object) [
					'name'          => 'Categories',
					'singular_name' => 'Category',
				],
			],
			'post_tag' => (object) [
				'hierarchical' => false,
				'labels'       => (object) [
					'name'          => 'Tags',
					'singular_name' => 'Tag',
				],
			],
		] );
		Functions\when( 'wp_parse_args' )->alias( function ( $args, $defaults ) {
			return array_merge( $defaults, $args );
		} );
		Functions\stubTranslationFunctions();

		$method = new ReflectionMethod( Rules::class, 'get_taxonomy_rules' );
		$method->setAccessible( true );
		$rules = $method->invoke( new Rules() );

		$this->assertArrayHasKey( 'content_is_child_of_tax_category', $rules );
		$this->assertArrayHasKey( 'content_is_ancestor_of_tax_category', $rules );
		$this->assertArrayNotHasKey( 'content_is_child_of_tax_post_tag', $rules );
		$this->assertArrayNotHasKey( 'content_is_ancestor_of_tax_post_tag', $rules );
	}

	/**
	 * The child condition matches only an immediate selected parent.
	 *
	 * @return void
	 */
	public function test_child_condition_matches_immediate_parent() {
		$selected = [ 10 ];
		$this->stub_term_rule_context( $selected, (object) [
			'term_id'  => 20,
			'parent'   => 10,
			'taxonomy' => 'category',
		] );

		$this->assertTrue( content_is_child_of_term() );

		$selected = [ 5 ];
		$this->assertFalse( content_is_child_of_term() );
	}

	/**
	 * The ancestor condition matches any selected ancestor in the hierarchy.
	 *
	 * @return void
	 */
	public function test_ancestor_condition_matches_any_selected_ancestor() {
		$selected = [ 5 ];
		$this->stub_term_rule_context( $selected, (object) [
			'term_id'  => 20,
			'parent'   => 10,
			'taxonomy' => 'category',
		] );
		Functions\when( 'get_ancestors' )->justReturn( [ 10, 5 ] );

		$this->assertTrue( content_is_ancestor_of_term() );

		$selected = [ 99 ];
		$this->assertFalse( content_is_ancestor_of_term() );
	}

	/**
	 * The current taxonomy term is resolved from the main archive query.
	 *
	 * @return void
	 */
	public function test_resolves_term_from_main_archive_query() {
		$term  = (object) [
			'term_id'  => 20,
			'parent'   => 10,
			'taxonomy' => 'category',
		];
		$query = Mockery::mock();
		$query->shouldReceive( 'is_category' )->once()->andReturn( true );
		$query->shouldReceive( 'get_queried_object' )->once()->andReturn( $term );

		Functions\when( '\ContentControl\current_query_context' )->justReturn( 'main' );
		Functions\when( '\ContentControl\get_main_wp_query' )->justReturn( $query );
		Functions\when( 'is_wp_error' )->justReturn( false );

		$this->assertSame( $term, get_current_taxonomy_term( 'category' ) );
	}

	/**
	 * Stub one hierarchical term-rule evaluation.
	 *
	 * @param array<int> $selected Selected term IDs.
	 * @param object     $term     Current term.
	 * @return void
	 */
	private function stub_term_rule_context( &$selected, $term ) {
		Functions\when( '\ContentControl\Rules\get_rule_extra' )->alias( function ( $key, $default_value ) {
			return 'taxonomy' === $key ? 'category' : $default_value;
		} );
		Functions\when( '\ContentControl\Rules\get_rule_option' )->alias( function ( $key, $default_value ) use ( &$selected ) {
			return 'selected' === $key ? $selected : $default_value;
		} );
		Functions\when( '\ContentControl\current_query_context' )->justReturn( 'terms' );
		Functions\when( 'get_global' )->justReturn( $term );
		Functions\when( 'wp_parse_id_list' )->alias( function ( $ids ) {
			return array_map( 'intval', (array) $ids );
		} );
		Functions\when( 'is_taxonomy_hierarchical' )->justReturn( true );
		Functions\when( 'is_wp_error' )->justReturn( false );
	}
}
