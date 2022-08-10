<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl;

use ContentControl\Interfaces\Controller;
use ContentControl\RuleEngine\Handler;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend
 */
class Frontend implements Controller {

	/**
	 * Initialize Hooks & Filters
	 */
	public function init() {
		new Frontend\Posts();
		new Frontend\Feeds();
		new Frontend\Widgets();
		new Frontend\Restrictions();

		if ( is_admin() ) {
			return;
		}

		add_filter( 'pre_render_block', [ $this, 'pre_render_block' ], 10, 3 );
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
			'conditional' => null,
		] );

		if ( $rules['conditional'] ) {
			$handler = new Handler( $rules['conditional']['conditionSets'], $rules['conditional']['anyAll'] );

			$check = $handler->check_rules();

			if ( ! $handler->check_rules() ) {
				return '';
			}
		}

		return $pre_render;
	}
}
