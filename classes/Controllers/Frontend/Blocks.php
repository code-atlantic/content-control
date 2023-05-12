<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend;

use ContentControl\Base\Controller;
use ContentControl\RuleEngine\Handler;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend
 */
class Blocks extends Controller {

	/**
	 * Initialize Hooks & Filters
	 */
	public function init() {
		if ( is_admin() ) {
			return;
		}

		add_filter( 'pre_render_block', [ $this, 'pre_render_block' ], 10, 3 );
		add_filter( 'render_block', [ $this, 'render_block' ], 10, 2 );
	}

	/**
	 * Check if block has controls enabled.
	 *
	 * @param array $block Block to be checked.
	 * @return boolean Whether the block has Controls enabled.
	 */
	public function has_block_controls( $block ) {
		if ( ! isset( $block['attrs']['contentControls'] ) ) {
			return false;
		}

		$controls = wp_parse_args( $block['attrs']['contentControls'], [
			'enabled' => false,
		] );

		return ! ! $controls['enabled'];
	}

	/**
	 * Get blocks controls if enabled.
	 *
	 * @param array $block Block to get controls from.
	 * @return array|null Controls if enabled.
	 */
	public function get_block_controls( $block ) {
		if ( ! $this->has_block_controls( $block ) ) {
			return null;
		}

		return wp_parse_args( $block['attrs']['contentControls'], [
			'enabled' => false,
			'rules'   => [],
		] );
	}

	/**
	 * Short curcuit block rendering for hidden blocks.
	 *
	 * @param string|null   $pre_render   The pre-rendered content. Default null.
	 * @param array         $parsed_block The block being rendered.
	 * @param WP_Block|null $parent_block If this is a nested block, a reference to the parent block.
	 *
	 * @return string|null
	 */
	public function pre_render_block( $pre_render, $parsed_block, $parent_block ) {
		if ( ! isset( $parsed_block['attrs']['contentControls'] ) ) {
			return $pre_render;
		}

		$controls = wp_parse_args( $parsed_block['attrs']['contentControls'], [
			'enabled' => false,
			'rules'   => [],
		] );

		if ( ! $controls['enabled'] ) {
			return $pre_render;
		}

		$rules = wp_parse_args( $controls['rules'], [
			'user'        => null,
			'conditional' => null,
		] );

		// Check User Rules.
		if ( $rules['user'] ) {
			$user_status = ! empty( $rules['user']['userStatus'] ) ? $rules['user']['userStatus'] : false;
			$role_match  = ! empty( $rules['user']['ruleMatch'] ) ? $rules['user']['ruleMatch'] : 'any';
			$user_roles  = ! empty( $rules['user']['userRoles'] ) ? $rules['user']['userRoles'] : [];

			if ( ! \ContentControl\user_meets_requirements( $user_status, $user_roles, $role_match ) ) {
				return '';
			}
		}

		if ( $rules['conditional'] ) {
			$handler = new Handler( $rules['conditional']['conditionSets'], $rules['conditional']['anyAll'] );

			$check = $handler->check_rules();

			if ( ! $handler->check_rules() ) {
				return '';
			}
		}

		return $pre_render;
	}


	/**
	 * Get any classes to be added to the outer block element.
	 *
	 * @param array $block Block to get classes for.
	 * @return null|array
	 */
	public function get_block_control_classes( $block ) {
		if ( ! $this->has_block_controls( $block ) ) {
			return null;
		}

		$classes = [];

		$controls = $this->get_block_controls( $block );

		if ( isset( $controls['rules']['device'] ) ) {
			$device_rules = wp_parse_args( $controls['rules']['device'], [
				'hideOn' => [],
			] );

			$hide_on = wp_parse_args( $device_rules['hideOn'], [
				'mobile'  => null,
				'tablet'  => null,
				'desktop' => null,
			] );

			foreach ( $hide_on as $device => $hidden ) {
				if ( $hidden ) {
					$classes[] = 'cc-hide-on-' . esc_attr( $device );
				}
			}
		}

		$classes = apply_filters( 'content_control_get_block_control_classes', $classes, $block );

		return array_unique( $classes );
	}


	/**
	 *
	 * References: https://github.com/WordPress/gutenberg/search?l=PHP&q=%27render_block%27
	 * - https://github.com/WordPress/gutenberg/blob/9aab0c4f60c78d19aae0af3351a2b66f8fa4c162/lib/block-supports/layout.php#L317
	 * - https://github.com/WordPress/gutenberg/blob/e776b4f00f690ce9cf21c027ebf5e7442420d716/lib/block-supports/duotone.php#L503
	 * - https://github.com/WordPress/gutenberg/blob/9aab0c4f60c78d19aae0af3351a2b66f8fa4c162/lib/block-supports/elements.php#L54-L72
	 *
	 * @param string $block_content Blocks rendered html.
	 * @param array  $block Array of block properties.
	 *
	 * @return string
	 */
	public function render_block( $block_content, $block ) {
		if ( ! $this->has_block_controls( $block ) ) {
			return $block_content;
		}

		$classes = $this->get_block_control_classes( $block );

		if ( empty( $classes ) ) {
			return $block_content;
		}

		// Enqueue the styles.
		wp_enqueue_style( 'content-control-block-styles' );

		$class_name = implode( ' ', $classes );

		/** Mimicing WP Cores usage in https://github.com/WordPress/wordpress-develop/blob/trunk/src/wp-includes/block-supports/elements.php#L32 */
		$html_element_matches = [];
		preg_match( '/<[^>]+>/', $block_content, $html_element_matches, PREG_OFFSET_CAPTURE );
		$first_element = $html_element_matches[0][0];

		// If the first HTML element has a class attribute just add the new class
		// as we do on layout and duotone.
		if ( strpos( $first_element, 'class="' ) !== false || strpos( $first_element, "class='" ) !== false ) {
			$content = preg_replace(
				// Matches $1 & $3 is ' or ", $2 are the existing classes.
				'/class=([\'"])([a-z0-9-_ ]*)([\'"])/',
				'class=$1$2 ' . $class_name . '$3',
				$block_content,
				1
			);
		} else {
			// If the first HTML element has no class attribute we should inject the attribute before the attribute at the end.
			$first_element_offset = $html_element_matches[0][1];
			$content              = substr_replace( $block_content, ' class="' . $class_name . '"', $first_element_offset + strlen( $first_element ) - 1, 0 );
		}

		return $content;
	}
}
