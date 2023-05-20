<?php
/**
 * Rule callbacks.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\RuleEngine;

defined( 'ABSPATH' ) || exit;


/**
 * Class RuleCallbacks
 */
class RuleCallbacks {

	/**
	 * Check if this is the home page.
	 *
	 * @return bool
	 */
	public static function is_home_page() {
		$checks = [
			is_front_page(),
			is_main_query(),
		];

		if ( 'content_control_should_hide_block' === current_filter() ) {
			// Checking block visibility, in the loop.
			$checks[] = in_the_loop();
		} else {
			// Checking current page, globally, not in the loop.
			$checks[] = ! in_the_loop();
		}

		return ! in_array( false, $checks, true );
	}

	/**
	 * Check if this is the home page.
	 *
	 * @return bool
	 */
	public static function is_blog_index() {
		return is_home() && is_main_query() && ! in_the_loop();
	}

	/**
	 * Checks if this is one of the selected post_type items.
	 *
	 * @param array $rule The rule options.
	 *
	 * @return bool
	 */
	public static function post_type( $rule = [] ) {
		global $post;

		$target = explode( '_', $rule['target'] );

		// Modifier should be the last key.
		$modifier = array_pop( $target );

		// Post type is the remaining keys combined.
		$post_type = implode( '_', $target );

		$selected = ! empty( $rule['settings']['selected'] ) ? $rule['settings']['selected'] : [];

		switch ( $modifier ) {
			case 'index':
				if ( is_post_type_archive( $post_type ) ) {
					return true;
				}
				break;

			case 'all':
				// Checks for valid post type, if $post_type is page, then include the front page as most users simply expect this.
				if ( self::is_post_type( $post_type ) || ( 'page' === $post_type && is_front_page() ) ) {
					return true;
				}
				break;

			case 'ID':
			case 'selected':
				if ( self::is_post_type( $post_type ) && is_singular( $post_type ) && in_array( $post->ID, wp_parse_id_list( $selected ), true ) ) {
					return true;
				}
				break;

			case 'children':
				if ( ! is_post_type_hierarchical( $post_type ) || ! is_singular( $post_type ) ) {
					return false;
				}

				// Chosen parents.
				$selected = wp_parse_id_list( $selected );

				foreach ( $selected as $id ) {
					if ( $post->post_parent === $id ) {
						return true;
					}
				}
				break;

			case 'ancestors':
				if ( ! is_post_type_hierarchical( $post_type ) || ! is_singular( $post_type ) ) {
					return false;
				}

				// Ancestors of the current page.
				$ancestors = get_post_ancestors( $post->ID );

				// Chosen parent/grandparents.
				$selected = wp_parse_id_list( $selected );

				foreach ( $selected as $id ) {
					if ( in_array( $id, $ancestors, true ) ) {
						return true;
					}
				}
				break;

			case 'template':
				if ( is_page() && is_page_template( $selected ) ) {
					return true;
				}
				break;
		}

		return false;
	}

	/**
	 * Checks if this is one of the selected taxonomy term.
	 *
	 * @param array $rule The rule options.
	 *
	 * @return bool
	 */
	public static function taxonomy( $rule = [] ) {
		$target   = explode( '_', $rule['target'] );
		$settings = isset( $rule['settings'] ) ? $rule['settings'] : [];

		// Remove the tax_ prefix.
		array_shift( $target );

		// Assign the last key as the modifier _all, _selected.
		$modifier = array_pop( $target );

		// Whatever is left is the taxonomy.
		$taxonomy = implode( '_', $target );

		if ( 'category' === $taxonomy ) {
			return self::category( $rule );
		} elseif ( 'post_tag' === $taxonomy ) {
			return self::post_tag( $rule );
		}

		switch ( $modifier ) {
			case 'all':
				if ( is_tax( $taxonomy ) ) {
					return true;
				}
				break;

			case 'ID':
			case 'selected':
				$selected = ! empty( $rule['settings']['selected'] ) ? $rule['settings']['selected'] : [];

				if ( is_tax( $taxonomy, wp_parse_id_list( $selected ) ) ) {
					return true;
				}
				break;
		}

		return false;
	}

	/**
	 * Checks if this is one of the selected categories.
	 *
	 * @param array $rule The rule options.
	 *
	 * @return bool
	 */
	public static function category( $rule = [] ) {
		$target   = explode( '_', $rule['target'] );
		$settings = isset( $rule['settings'] ) ? $rule['settings'] : [];

		// Assign the last key as the modifier _all, _selected.
		$modifier = array_pop( $target );

		switch ( $modifier ) {
			case 'all':
				if ( is_category() ) {
					return true;
				}
				break;

			case 'selected':
				$selected = ! empty( $rule['settings']['selected'] ) ? $rule['settings']['selected'] : [];
				if ( is_category( wp_parse_id_list( $selected ) ) ) {
					return true;
				}
				break;
		}

		return false;
	}

	/**
	 * Checks if this is one of the selected tags.
	 *
	 * @param array $rule The rule options.
	 *
	 * @return bool
	 */
	public static function post_tag( $rule = [] ) {
		$target   = explode( '_', $rule['target'] );
		$settings = isset( $rule['settings'] ) ? $rule['settings'] : [];

		// Assign the last key as the modifier _all, _selected.
		$modifier = array_pop( $target );

		switch ( $modifier ) {
			case 'all':
				if ( is_tag() ) {
					return true;
				}
				break;

			case 'selected':
				$selected = ! empty( $rule['settings']['selected'] ) ? $rule['settings']['selected'] : [];
				if ( is_tag( wp_parse_id_list( $selected ) ) ) {
					return true;
				}
				break;
		}

		return false;
	}

	/**
	 * Checks if the post_type has the selected categories.
	 *
	 * @param array $rule The rule options.
	 *
	 * @return bool
	 */
	public static function post_type_tax( $rule = [] ) {
		$target   = explode( '_w_', $rule['target'] );
		$settings = isset( $rule['settings'] ) ? $rule['settings'] : [];

		// First key is the post type.
		$post_type = array_shift( $target );

		// Last Key is the taxonomy.
		$taxonomy = array_pop( $target );

		if ( 'category' === $taxonomy ) {
			return self::post_type_category( $rule );
		} elseif ( 'post_tag' === $taxonomy ) {
			return self::post_type_tag( $rule );
		}

		$selected = ! empty( $rule['settings']['selected'] ) ? $rule['settings']['selected'] : [];
		if ( self::is_post_type( $post_type ) && has_term( wp_parse_id_list( $selected ), $taxonomy ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Checks if the post_type has the selected categories.
	 *
	 * @param array $rule The rule options.
	 *
	 * @return bool
	 */
	public static function post_type_category( $rule = [] ) {
		$target   = explode( '_w_', $rule['target'] );
		$settings = isset( $rule['settings'] ) ? $rule['settings'] : [];

		// First key is the post type.
		$post_type = array_shift( $target );

		$selected = ! empty( $rule['settings']['selected'] ) ? $rule['settings']['selected'] : [];
		if ( self::is_post_type( $post_type ) && has_category( wp_parse_id_list( $selected ) ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Checks is a post_type has the selected tags.
	 *
	 * @param array $rule Condition.
	 *
	 * @return bool
	 */
	public static function post_type_tag( $rule = [] ) {
		$target   = explode( '_w_', $rule['target'] );
		$settings = isset( $rule['settings'] ) ? $rule['settings'] : [];

		// First key is the post type.
		$post_type = array_shift( $target );

		$selected = ! empty( $rule['settings']['selected'] ) ? $rule['settings']['selected'] : [];
		if ( self::is_post_type( $post_type ) && has_tag( wp_parse_id_list( $selected ) ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Checks if the current post is a post type.
	 *
	 * @param string $post_type Post type slug.
	 * @return boolean
	 */
	public static function is_post_type( $post_type ) {
		global $post;
		return is_object( $post ) && ( is_singular( $post_type ) || $post->post_type === $post_type );
	}

}
