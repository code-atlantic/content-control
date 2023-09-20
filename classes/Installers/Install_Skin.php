<?php
/**
 * Install_Skin class.
 *
 * @package ContentControl
 * @subpackage Installers
 * @since 2.0.0
 */

namespace ContentControl\Installers;

/**
 * Skin for on-the-fly addon installations.
 *
 * @since 1.0.0
 * @since 2.0.0 Extend PluginSilentUpgraderSkin and clean up the class.
 */
class Install_Skin extends PluginSilentUpgraderSkin {

	/**
	 * Instead of outputting HTML for errors, json_encode the errors and send them
	 * back to the Ajax script for processing.
	 *
	 * @since 2.0.0
	 *
	 * @param string|\WP_Error $errors Array of errors with the install process.
	 */
	public function error( $errors ) {
		if ( ! empty( $errors ) ) {
			return wp_send_json_error( $errors );
		}

		return $errors;
	}
}
