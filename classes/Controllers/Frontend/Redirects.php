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
use function ContentControl\protection_is_disabled;
use function ContentControl\user_is_excluded;

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
		if ( user_is_excluded() || protection_is_disabled() ) {
			return;
		}

		if ( ! content_is_restricted() ) {
			return;
		}

		$restriction = $this->container->get( 'restrictions' )->get_applicable_restriction();

		if ( ! $restriction ) {
			return;
		}

		switch ( $restriction->protection_method ) {
			case 'redirect':
				$this->redirect( $restriction );
				break;
			case 'message':
				if ( 'redirect' === $restriction->archive_handling && is_archive() ) {
					$this->redirect( $restriction );
				}
				break;
		}
	}

	/**
	 * Redirect to the appropriate location.
	 *
	 * @param Restriction $restriction Restriction object.
	 * @return void
	 */
	public function redirect( $restriction ) {
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
