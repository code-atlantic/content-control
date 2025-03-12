<?php
/**
 * Frontend query post restrictions.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend\Restrictions;

use ContentControl\Base\Controller;

use function ContentControl\query_can_be_ignored;
use function ContentControl\protection_is_disabled;
use function ContentControl\get_restriction_matches_for_queried_terms;
use function ContentControl\is_rest;

defined( 'ABSPATH' ) || exit;

/**
 * Class for handling global restrictions of the query posts.
 *
 * @package ContentControl
 */
class QueryTerms extends Controller {

	/**
	 * Initiate functionality.
	 *
	 * @return void
	 */
	public function init() {
		// We delay this until functions.php is loaded, so that users can use the content_control/query_filter_init_hook filter.
		// The assumption is that most code should be registered by init 999999, so we'll use that as the default.
		add_action( 'init', [ $this, 'register_hooks' ], 999999 );
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		/**
		 * Use this filter to change the hook used to add query post filtering.
		 *
		 * This only applies to alternate queries, not the main query, and is used for removing
		 * posts from the query that are restricted.
		 *
		 * - Register earlier for more restriction coverage.
		 * - Register later for more compatibility with other plugins that late register post types.
		 *
		 * @param null|string $init_hook The hook to use to add the query post filtering.
		 * @return null|string The hook to use, should be: wp_loaded, or maybe even parse_query or wp (if you know what you're doing).
		 */
		$init_hook = apply_filters( 'content_control/query_filter_init_hook', null );

		/**
		 * Use this filter to change the priority used to add query post filtering.
		 *
		 * @param int $init_priority The priority to use to add the query post filtering.
		 * @return int The priority to use. Default: 999.
		 */
		$init_priority = apply_filters( 'content_control/query_filter_init_priority', 999 );

		if ( is_null( $init_hook ) || ! did_action( $init_hook ) ) {
			// If the user has not specified a hook, we'll use the default (now).
			$this->enable_query_filtering();
			return;
		}

		add_action( (string) $init_hook, [ $this, 'enable_query_filtering' ], (int) $init_priority );
	}

	/**
	 * Late hooks.
	 *
	 * @return void
	 */
	public function enable_query_filtering() {
		add_filter( 'get_terms', [ $this, 'restrict_query_terms' ], 10, 4 );
	}

	/**
	 * Handle restricted content appropriately.
	 *
	 * NOTE. This is only for filtering terms, and should not
	 *       be used to redirect or replace the entire page.
	 *
	 * @param \WP_Term[]          $terms      Array of terms to filter.
	 * @param string              $taxonomy   The taxonomy.
	 * @param array<string,mixed> $query_vars Array of query vars.
	 * @param \WP_Term_Query      $query The WP_Query instance (passed by reference).
	 *
	 * @return \WP_Term[]
	 */
	public function restrict_query_terms( $terms, $taxonomy, $query_vars, $query ) {
		if ( query_can_be_ignored( $query ) ) {
			return $terms;
		}

		if ( protection_is_disabled() ) {
			return $terms;
		}

		$term_restrictions = get_restriction_matches_for_queried_terms( $query );

		if ( false === $term_restrictions ) {
			return $terms;
		}

		// If we have restrictions on the queried terms, handle them top down.
		foreach ( $term_restrictions as $match ) {
			$term_id     = $match['term_ids'];
			$restriction = $match['restriction'];

			/**
			 * Use this filter to prevent a term from being restricted, or to handle it yourself.
			 *
			 * @param null|mixed                              $pre         Whether to prevent the term from being restricted.
			 * @param null|\ContentControl\Models\Restriction $restriction Restriction object.
			 * @param int[]                                   $term_id     Term ID.
			 * @return null|mixed
			 */
			if ( null !== apply_filters( 'content_control/pre_restrict_archive_term', null, $restriction, $term_id ) ) {
				continue;
			}

			/**
			 * Fires when a term is restricted, but before the restriction is handled.
			 *
			 * @param \ContentControl\Models\Restriction $restriction Restriction object.
			 * @param int[]                          $term_id     Perm ID.
			 */
			do_action( 'content_control/restrict_archive_term', $restriction, $term_id );

			$handling = $restriction->get_setting( 'additionalQueryHandling' );

			// If this is a search query and showInSearch is false, hide the post.
			if ( $query->query_vars['search'] && false === $restriction->get_setting( 'showInSearch' ) ) {
				$handling = 'hide';
			}

			switch ( $handling ) {
				case 'hide':
					foreach ( $terms as $key => $term ) {
						if ( in_array( $term->term_id, $term_id, true ) ) {
							unset( $terms[ $key ] );
						}
					}

					// Reset term indexes.
					$query->terms = array_values( $terms );
					break;
			}
		}

		return $terms;
	}
}
