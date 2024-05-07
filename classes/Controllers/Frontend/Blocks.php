<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend;

use ContentControl\Base\Controller;

use function ContentControl\protection_is_disabled;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend
 */
class Blocks extends Controller {

	/**
	 * Initialize Hooks & Filters.
	 *
	 * @return void
	 */
	public function init() {
		if ( is_admin() ) {
			return;
		}

		add_action( 'wp_loaded', [ $this, 'register_block_attributes' ], 100 );
		add_filter( 'pre_render_block', [ $this, 'pre_render_block' ], 999, 3 );
		add_filter( 'render_block', [ $this, 'render_block' ], 10, 2 );
		add_filter( 'content_control/should_hide_block', [ $this, 'block_user_rules' ], 10, 2 );
		add_action( 'wp_print_styles', [ $this, 'print_block_styles' ] );
	}

	/**
	 * Adds custom attributes to allowed block attributes.
	 *
	 * @return void
	 */
	public function register_block_attributes() {
		$registered_blocks = \WP_Block_Type_Registry::get_instance()->get_all_registered();

		foreach ( $registered_blocks as $name => $block ) {
			$block->attributes['contentControls'] = [
				'type'    => 'object',
				'default' => [
					'enabled' => false,
					'rules'   => [],
				],
			];
		}
	}

	/**
	 * Check if block has controls enabled.
	 *
	 * @param array<string,mixed> $block Block to be checked.
	 * @return boolean Whether the block has Controls enabled.
	 */
	public function has_block_controls( $block ) {
		if ( ! isset( $block['attrs']['contentControls'] ) ) {
			return false;
		}

		$controls = wp_parse_args( $block['attrs']['contentControls'], [
			'enabled' => false,
		] );

		return (bool) $controls['enabled'];
	}

	/**
	 * Get blocks controls if enabled.
	 *
	 * @param array{attrs:array<string,mixed>} $block Block to get controls for.
	 * @return array{enabled:bool,rules:array<string,mixed>}|null Controls if enabled.
	 */
	public function get_block_controls( $block ) {
		if ( ! $this->has_block_controls( $block ) ) {
			return null;
		}

		/**
		 * Controls for the block.
		 *
		 * @var array{enabled:bool,rules:array<string,mixed>} $controls
		 */
		$controls = wp_parse_args( $block['attrs']['contentControls'], [
			'enabled' => false,
			'rules'   => [],
		] );

		return $controls;
	}

	/**
	 * Check block rules to see if it should be hidden from user.
	 *
	 * @param array{attrs:array<string,mixed>} $block Block to get controls for.
	 *
	 * @return boolean Whether the block should be hidden.
	 */
	public function should_hide_block( $block ) {
		if ( protection_is_disabled() ) {
			return false;
		}

		if ( ! $this->has_block_controls( $block ) ) {
			return false;
		}

		$controls = $this->get_block_controls( $block );

		if ( ! $controls['enabled'] ) {
			return false;
		}

		/**
		 * Filter whether to hide the block.
		 *
		 * @param bool  $should_hide Whether the block should be hidden.
		 * @param array $rules  Rules to check.
		 * @param array $block  The block being rendered.
		 * @return bool
		 */
		$should_hide = apply_filters(
			'content_control/should_hide_block',
			false,
			$controls['rules'],
			$block
		);

		return $should_hide;
	}

	/**
	 * Short curcuit block rendering for hidden blocks.
	 *
	 * @param string|null         $pre_render   The pre-rendered content. Default null.
	 * @param array<string,mixed> $parsed_block The block being rendered.
	 * @param \WP_Block|null      $parent_block If this is a nested block, a reference to the parent block.
	 *
	 * @return string|null
	 */
	public function pre_render_block( $pre_render, $parsed_block, $parent_block ) {
		return $this->should_hide_block( $parsed_block ) ? '' : $pre_render;
	}

	/**
	 * Check block rules to see if it should be hidden from user.
	 *
	 * @param bool                                   $should_hide Whether the block should be hidden.
	 * @param array<string,array<string,mixed>|null> $rules  Rules to check.
	 * @return bool
	 */
	public function block_user_rules( $should_hide, $rules ) {
		$rules = wp_parse_args( $rules, [
			'user' => null,
		] );

		if ( null === $rules['user'] || true === $should_hide ) {
			return $should_hide;
		}

		$user_status = ! empty( $rules['user']['userStatus'] ) ? $rules['user']['userStatus'] : false;
		$role_match  = ! empty( $rules['user']['roleMatch'] ) ? $rules['user']['roleMatch'] : 'any';
		$user_roles  = ! empty( $rules['user']['userRoles'] ) ? $rules['user']['userRoles'] : [];

		if ( ! \ContentControl\user_meets_requirements( $user_status, $user_roles, $role_match ) ) {
			return true;
		}

		return $should_hide;
	}

	/**
	 * Get any classes to be added to the outer block element.
	 *
	 * @param array{attrs:array<string,mixed>} $block Block to get controls for.
	 * @return null|string[]
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

		/**
		 * Filter the classes to be added to the block.
		 *
		 * @param array $classes Classes to be added.
		 * @param array $controls Controls for the block.
		 * @param array $block Block to get classes for.
		 *
		 * @return string[]
		 */
		$classes = apply_filters( 'content_control/get_block_control_classes', $classes, $controls, $block );

		return array_unique( $classes );
	}

	/**
	 * Filter the block attributes, primarily to add classes and control visibility.
	 *
	 * References: https://github.com/WordPress/gutenberg/search?l=PHP&q=%27render_block%27
	 * - https://github.com/WordPress/gutenberg/blob/9aab0c4f60c78d19aae0af3351a2b66f8fa4c162/lib/block-supports/layout.php#L317
	 * - https://github.com/WordPress/gutenberg/blob/e776b4f00f690ce9cf21c027ebf5e7442420d716/lib/block-supports/duotone.php#L503
	 * - https://github.com/WordPress/gutenberg/blob/9aab0c4f60c78d19aae0af3351a2b66f8fa4c162/lib/block-supports/elements.php#L54-L72
	 *
	 * @param string              $block_content Blocks rendered html.
	 * @param array<string,mixed> $block Array of block properties.
	 *
	 * @return string
	 */
	public function render_block( $block_content, $block ) {
		if ( ! $this->has_block_controls( $block ) ) {
			return $block_content;
		}

		// If the block should be hidden, return an empty string.
		// This catches blocks that should be hidden but were missed by pre_render_block.
		// This applies to core/navigation-link blocks for example.
		if ( $this->should_hide_block( $block ) ) {
			return '';
		}

		$classes = $this->get_block_control_classes( $block );

		if ( empty( $classes ) ) {
			return $block_content;
		}

		// Enqueue the styles.
		// wp_enqueue_style( 'content-control-block-styles' );.

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

	/**
	 * Print the styles for the block controls.
	 *
	 * @return void
	 */
	public function print_block_styles() {
		$media_queries = $this->container->get_option( 'mediaQueries' );

		if ( ! $media_queries ) {
			?>
			<style id="content-control-block-styles">
				@media (max-width: 480px) {
					.cc-hide-on-mobile {
						display: none !important;
					}
				}
				@media (min-width: 481px) and (max-width: 991px) {
					.cc-hide-on-tablet {
						display: none !important;
					}
				}
				@media (min-width: 992px) {
					.cc-hide-on-desktop {
						display: none !important;
					}
				}
			</style>
			<?php
			return;
		}

		$mobile_breakpoint  = isset( $media_queries['mobile'] ) ? $media_queries['mobile']['breakpoint'] : 640;
		$tablet_breakpoint  = isset( $media_queries['tablet'] ) ? $media_queries['tablet']['breakpoint'] : 920;
		$desktop_breakpoint = isset( $media_queries['desktop'] ) ? $media_queries['desktop']['breakpoint'] : 1440;

		$tablet_start  = $mobile_breakpoint + 1;
		$desktop_start = $tablet_breakpoint + 1;

		$styles[] = <<<CSS
@media (max-width: {$mobile_breakpoint}px) {
	.cc-hide-on-mobile {
		display: none !important;
	}
}
CSS;

		$styles[] = <<<CSS
@media (min-width: {$tablet_start}px) and (max-width: {$tablet_breakpoint}px) {
	.cc-hide-on-tablet {
		display: none !important;
	}
}
CSS;

		$styles[] = <<<CSS
@media (min-width: {$desktop_start}px) and (max-width: {$desktop_breakpoint}px) {
	.cc-hide-on-desktop {
		display: none !important;
	}
}
CSS;

		unset( $media_queries['mobile'], $media_queries['tablet'], $media_queries['desktop'] );

		foreach ( $media_queries as $media_query => $media_query_settings ) {
			$breakpoint = $media_query_settings['breakpoint'];

			$style = <<<CSS
@media (min-width: {$breakpoint}px) {
	.cc-hide-on-{$media_query} {
		display: none !important;
	}
}
CSS;

			$styles[] = apply_filters( 'content_control/block_styles', $style, $media_query, $breakpoint );
		}

		$styles = implode( "\n", $styles );

		?>
		<style id="content-control-block-styles">
			<?php echo $styles; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</style>
		<?php
	}
}
