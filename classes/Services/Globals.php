<?php
/**
 * Globals service.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Services;

defined( 'ABSPATH' ) || exit;

/**
 * Globals service.
 */
class Globals {

	/**
	 * Context.
	 *
	 * @var string|null
	 */
	public $current_query_context = null;

	/**
	 * Current query.
	 *
	 * @var \WP_Query|\WP_Term_Query|null
	 */
	public $current_query = null;

	/**
	 * Current post query.
	 *
	 * @var \WP_Query|null
	 */
	public $current_post_query = null;

	/**
	 * Current term query.
	 *
	 * @var \WP_Term_Query|null
	 */
	public $current_term_query = null;

	/**
	 * Current term.
	 *
	 * @var \WP_Term|null
	 */
	public $term = null;

	/**
	 * Overloaded posts stack.
	 *
	 * @var \WP_Post[]|null $overloaded_posts
	 */
	public $overloaded_posts = null;

	/**
	 * Overloaded terms stack.
	 *
	 * @var \WP_Term[]|null $overloaded_terms
	 */
	public $overloaded_terms = null;

	/**
	 * Last term.
	 *
	 * @var \WP_Term[]|null
	 */
	public $last_term = null;

	/**
	 * Current rule.
	 *
	 * @var \ContentControl\Models\RuleEngine\Rule|null
	 */
	public $current_rule = null;

	/**
	 * Current intent.
	 *
	 * @var null|array{
	 *      type: string,
	 *      name: string,
	 *      id: int,
	 *      index: bool,
	 *      search: string|false,
	 * }
	 */
	public $rest_intent = null;

	/**
	 * Constructor.
	 */
	public function __construct() {
	}

	/**
	 * Get context items by key.
	 *
	 * @param string $key Context key.
	 * @param mixed  $default_value Default value.
	 *
	 * @return mixed
	 */
	public function get( $key, $default_value = null ) {
		return property_exists( $this, $key ) ? $this->$key : $default_value;
	}

	/**
	 * Set context items by key.
	 *
	 * @param string $key Context key.
	 * @param mixed  $value Context value.
	 *
	 * @return void
	 */
	public function set( $key, $value ) {
		if ( property_exists( $this, $key ) ) {
			$this->$key = $value;
		}
	}

	/**
	 * Reset context items by key.
	 *
	 * @param string $key Context key.
	 *
	 * @return void
	 */
	public function reset( $key ) {
		if ( property_exists( $this, $key ) ) {
			$this->$key = null;
		}
	}

	/**
	 * Reset all context items.
	 *
	 * @return void
	 */
	public function reset_all() {
		$this->reset( 'current_query_context' );
		$this->reset( 'current_query' );
		$this->reset( 'current_post_query' );
		$this->reset( 'current_term_query' );
		$this->reset( 'current_rule' );
		$this->reset( 'term' );
		$this->reset( 'overloaded_posts' );
		$this->reset( 'overloaded_terms' );
		$this->reset( 'last_term' );
		$this->reset( 'rest_intent' );
	}

	/**
	 * Push to stack.
	 *
	 * @param string $key Context key.
	 * @param mixed  $value Context value.
	 *
	 * @return void
	 */
	public function push_to_stack( $key, $value ) {
		if ( property_exists( $this, $key ) ) {
			$values = $this->get( $key, [] );

			$values[] = $value;

			$this->set( $key, $values );
		}
	}

	/**
	 * Pop from stack.
	 *
	 * @param string $key Context key.
	 *
	 * @return mixed
	 */
	public function pop_from_stack( $key ) {
		if ( property_exists( $this, $key ) ) {
			$values = $this->get( $key, [] );

			if ( empty( $values ) ) {
				return null;
			}

			$value = array_pop( $values );

			$this->set( $key, $values );

			return $value;
		}

		return null;
	}

	/**
	 * Check if stack is empty.
	 *
	 * @param string $key Context key.
	 *
	 * @return bool
	 */
	public function is_empty( $key ) {
		$value = $this->get( $key );

		return ! isset( $value ) || empty( $value );
	}
}
