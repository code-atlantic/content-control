<?php
/**
 * Frontend general setup.
 *
 * @copyright (c) 2023, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers;

use ContentControl\Base\Controller;

use ContentControl\Controllers\Frontend\Blocks;
use ContentControl\Controllers\Frontend\Restrictions;
use ContentControl\Controllers\Frontend\Widgets;

defined( 'ABSPATH' ) || exit;

/**
 * Class Frontend
 */
class Frontend extends Controller {

	/**
	 * Initialize Hooks & Filters
	 */
	public function init() {
		$this->container->register_controllers([
			'Frontend\Blocks'       => new Blocks( $this->container ),
			'Frontend\Restrictions' => new Restrictions( $this->container ),
			'Frontend\Widgets'      => new Widgets( $this->container ),
		]);

		$this->hooks();
	}

	/**
	 * Register general frontend hooks.
	 *
	 * @return void
	 */
	public function hooks() {
		$this->replicate_core_content_filters();

		add_filter( 'content_control/restricted_post_content', '\ContentControl\append_post_excerpts', 9, 2 );
		add_filter( 'content_control/restricted_post_excerpt', '\ContentControl\append_post_excerpts', 9, 2 );
	}

	/**
	 * Replicate core content filters.
	 *
	 * @return void
	 */
	private function replicate_core_content_filters() {
		/**
		 * Instance of WP_Embed class.
		 *
		 * @var \WP_Embed $wp_embed
		 */
		global $wp_embed;

		$the_content = 'content_control/restricted_post_content';
		$the_excerpt = 'content_control/restricted_post_excerpt';

		// These all follow WP core's `the_content` filter.
		add_filter( $the_content, 'do_blocks', 9 );
		add_filter( $the_content, 'wptexturize' );
		add_filter( $the_content, 'convert_smilies', 20 );
		add_filter( $the_content, 'wpautop' );
		add_filter( $the_content, 'shortcode_unautop' );
		add_filter( $the_content, 'prepend_attachment' );
		add_filter( $the_content, 'wp_replace_insecure_home_url' );
		add_filter( $the_content, 'do_shortcode', 11 ); // AFTER wpautop().
		add_filter( $the_content, 'wp_filter_content_tags', 12 ); // Runs after do_shortcode().
		add_filter( $the_content, 'capital_P_dangit', 11 );
		add_filter( $the_content, [ $wp_embed, 'run_shortcode' ], 8 );
		add_filter( $the_content, [ $wp_embed, 'autoembed' ], 8 );

		// These all follow WP core's `the_excerpt` filter.
		add_filter( $the_excerpt, 'wptexturize' );
		add_filter( $the_excerpt, 'convert_smilies' );
		add_filter( $the_excerpt, 'convert_chars' );
		add_filter( $the_excerpt, 'wpautop' );
		add_filter( $the_excerpt, 'shortcode_unautop' );
		add_filter( $the_excerpt, 'wp_replace_insecure_home_url' );
		add_filter( $the_excerpt, 'wp_filter_content_tags', 12 );
		add_filter( $the_excerpt, 'capital_P_dangit', 11 );
	}
}
