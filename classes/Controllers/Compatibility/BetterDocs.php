<?php
/**
 * BetterDocs controller class.
 *
 * @package ContentControl
 */

namespace ContentControl\Controllers\Compatibility;

use ContentControl\Base\Controller;

/**
 * BetterDocs controller class.
 */
class BetterDocs extends Controller {

	/**
	 * Initiate hooks & filter.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'content_control/get_rest_api_intent', [ $this, 'get_rest_api_intent' ], 10 );
	}

	/**
	 * Check if controller is enabled.
	 *
	 * @return bool
	 */
	public function controller_enabled() {
		return defined( 'BETTERDOCS_PLUGIN_FILE' );
	}

	/**
	 * Get intent for BetterDocs.
	 *
	 * @param array<string,mixed> $intent Intent.
	 *
	 * @return array<string,mixed>
	 */
	public function get_rest_api_intent( $intent ) {
		global $wp;

		$rest_route     = $wp->query_vars['rest_route'];
		$endpoint_parts = explode( '/', str_replace( '/wp/v2/', '', $rest_route ) );

		// Set the custom search intent.
		if ( isset( $wp->query_vars['search'] ) ) {
			$intent['search'] = sanitize_title( $wp->query_vars['search'] );
		}

		if ( 'unknown' === $intent['type'] && 'docs' === $intent['name'] ) {
			// If we have a post type or taxonomy, the name is the first part (posts, categories).
			$post_type = sanitize_key( $endpoint_parts[0] );

			if ( 'docs' === $post_type ) {
				$intent['type'] = 'post_type';
			}
		}

		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		if ( isset( $_REQUEST['post_type'] ) ) {
			$post_type = sanitize_text_field( wp_unslash( $_REQUEST['post_type'] ) );

			// Check if any ct_forced_* request aregs are set. If so we should use the post type intent.
			if ( strpos( $post_type, 'ct_forced_' ) !== false ) {
				$intent['type'] = 'post_type';

				$post_type = str_replace( 'ct_forced_', '', $post_type );

				$intent['name'] = explode( ':', $post_type );
			}
		}
		// phpcs:enable WordPress.Security.NonceVerification.Recommended

		return $intent;
	}
}
