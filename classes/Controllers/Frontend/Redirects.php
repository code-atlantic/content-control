<?php
/**
 * Frontend redirect setup.
 *
 * @copyright (c) 2021, Code Atlantic LLC.
 * @package ContentControl
 */

namespace ContentControl\Controllers\Frontend;

use ContentControl\Base\Controller;

use function ContentControl\content_is_restricted;

defined( 'ABSPATH' ) || exit;

/**
 * Frontend redirection controller.
 */
class Redirects extends Controller {

	/**
	 * Initiate functionality.
	 */
	public function init() {
		if ( \ContentControl\is_rest() ) {
			return;
		}

		add_action( 'template_redirect', [ $this, 'template_redirect' ] );
	}

	/**
	 * Check if content protected by redirect.
	 */
	public function template_redirect() {
		if ( ! content_is_restricted() ) {
			return;
		}

		$restriction = $this->container->get( 'restrictions' )->get_applicable_restriction();

		if ( ! $restriction || 'redirect' !== $restriction->protection_method ) {
			return;
		}

		$redirect = false;

		switch ( $restriction->redirect_type ) {
			case 'login':
				$redirect = wp_login_url( \ContentControl\get_current_page_url() );
				break;

			case 'home':
				$redirect = home_url();
				break;

			case 'custom':
				$redirect = $restriction->redirect_url;
				break;

			default:
				// Do not redirect if not one of our values.
		}

		if ( $redirect ) {
			wp_safe_redirect( $redirect );
			exit;
		}
	}
}
